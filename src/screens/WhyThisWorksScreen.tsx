import { Link } from 'react-router-dom';

export function WhyThisWorksScreen() {
  return (
    <div className="min-h-screen bg-app-bg p-6 pb-12 max-w-lg mx-auto">
      <Link to="/" className="text-gray-400 text-sm mb-6 inline-block hover:text-gray-300">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold text-gray-50 mb-2">Why this works</h1>
      <p className="text-gray-400 mb-8">
        Neuroscience-backed principles behind Dopamine Detox
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-app-accent mb-2">The 90-second rule</h2>
          <p className="text-gray-300 leading-relaxed">
            Neuroscientist Jill Bolte Taylor found that when a trigger occurs, the
            biochemical cascade of emotion (like an urge) lasts about 90 seconds.
            If you don't feed it with a thought or action, it will pass on its own.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-app-accent mb-2">Urge surfing</h2>
          <p className="text-gray-300 leading-relaxed">
            Instead of fighting the urge, you "surf" it—observing it rise, peak,
            and fall without acting. The 90-second timer gives you structure to
            ride it out until the wave passes.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-app-accent mb-2">Replacement behaviors</h2>
          <p className="text-gray-300 leading-relaxed">
            Your brain has a slot for "what I do when I feel X." By consistently
            choosing a replacement (walk, pushups, water) instead of the addictive
            behavior, you rewire the habit loop.
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="block w-full py-4 bg-app-surface text-gray-50 font-semibold rounded-xl text-center"
      >
        Back
      </Link>
    </div>
  );
}
