export function PlaystationButtons() {
    return (
      <div className="relative w-64 h-64">
        {/* Triangle - Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 19.5H22L12 2Z" fill="#8fc9ff" stroke="#10061e" strokeWidth="1.5" />
          </svg>
        </div>
  
        {/* Square - Left */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-16 h-16">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" fill="#c11574" stroke="#10061e" strokeWidth="1.5" />
          </svg>
        </div>
  
        {/* Circle - Right */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-16 h-16">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#c11574" stroke="#10061e" strokeWidth="1.5" />
          </svg>
        </div>
  
        {/* X - Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L19 19M5 19L19 5" stroke="#8fc9ff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }
  