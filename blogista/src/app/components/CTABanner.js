export default function CTABanner() {
  return (
    <section className="bg-gradient-to-r from-blue-400 to-indigo-600 py-16 text-white text-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-5xl font-bold mb-4">
          Unlock Exclusive Insights
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Subscribe to our newsletter for the latest blog posts, tutorials, and industry insights.
        </p>
        <a
          href="/signup"
          className="bg-accent text-primary font-semibold px-8 py-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 z-10 relative"
        >
          Join Now
        </a>
      </div>
      {/* Background Decorative Element */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.1" d="M0,64L30,80C60,96,120,128,180,154.7C240,181,300,203,360,202.7C420,203,480,181,540,149.3C600,117,660,75,720,53.3C780,32,840,32,900,64C960,96,1020,160,1080,181.3C1140,203,1200,181,1260,154.7C1320,128,1380,96,1410,80L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0Z"/>
        </svg>
      </div>
    </section>
  );
}
