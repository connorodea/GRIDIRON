export function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute left-[calc(50%-4rem)] top-[calc(50%-4rem)] transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-48 xl:left-[calc(50%-24rem)]"
        viewBox="0 0 1108 632"
        aria-hidden="true"
      >
        <path
          fill="url(#gradient)"
          fillOpacity=".25"
          d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"
        />
        <defs>
          <linearGradient
            id="gradient"
            x1="1220.59"
            x2="-85.053"
            y1="432.766"
            y2="638.714"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F46E5" />
            <stop offset={1} stopColor="#80CAFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

