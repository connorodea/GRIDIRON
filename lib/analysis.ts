import OpenAI from 'openai';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PlayAnalysis {
  offensive_team: string | null;
  defensive_team: string | null;
  _quarter: string;
  _clock: string | null;
  score_differential: number | null;
  _drive: number | null;
  drive_play: number | null;
  field_position: string | null;
  _down: number | null;
  _distance: number | null;
  hash_offense: string | null;
  hash_defense: string | null;
  QB_location: string;
  number_of_BACKs: string;
  number_of_TEs: string;
  number_of_WRs: string;
  offensive_personnel: string;
}

export async function analyzeFootballPlay(files: File[]): Promise<PlayAnalysis[]> {
  try {
    const schemaPath = "/Volumes/G-DRIVE/Dec24/GridironAI/Gridiron_Data_Points.csv";
    let schemaContent: string;
    try {
      schemaContent = await fs.readFile(schemaPath, 'utf-8');
    } catch (error) {
      console.error("Error reading schema file:", error);
      throw new Error("Failed to read schema file");
    }

    const schema = parse(schemaContent, { columns: true });

    const results = await Promise.all(files.map(async (file, index) => {
      try {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        console.log(`Analyzing file ${index + 1} of ${files.length}`);
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `Analyze this American football play. Identify the following details based on the given schema. Provide the results in a JSON format matching the schema exactly:

                  ${JSON.stringify(schema, null, 2)}

                  If a value is not visible or cannot be determined, use null.`
                },
                { type: "image_url", image_url: { url: `data:image/gif;base64,${base64}` } },
              ],
            },
          ],
        });

        const content = response.choices[0].message.content;
        if (content) {
          console.log(`Successfully analyzed file ${index + 1}`);
          return JSON.parse(content) as PlayAnalysis;
        } else {
          throw new Error("No content in the API response");
        }
      } catch (error) {
        console.error(`Error analyzing file ${index + 1}:`, error);
        return null;
      }
    }));

    const validResults = results.filter((result): result is PlayAnalysis => result !== null);
    
    if (validResults.length === 0) {
      throw new Error("No valid analysis results were produced");
    }

    return validResults;
  } catch (error) {
    console.error("Error in analyzeFootballPlay:", error);
    throw error;
  }
}

