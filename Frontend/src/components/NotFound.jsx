import React from 'react'

const NotFound = () => {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">404</h1>
        <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="404" className="w-1/8 md:w-1/8" />
        <p className="text-base md:text-lg text-muted-foreground">Look like you're lost</p>
        <p className="text-sm md:text-base text-muted-foreground">The page you are looking for is not available!</p>
        <a href="/" className="link_404 mt-4 inline-block bg-accent text-accent-foreground rounded-lg px-4 py-2 hover:bg-accent/80">
            Go to Home
        </a>
        <style>{`
            .link_404 {
                color: #fff !important;
                padding: 10px 20px;
                background: #39ac31;
                margin: 20px 0;
                display: inline-block;
            }
        `}</style>
    </div>
)
}

export default NotFound