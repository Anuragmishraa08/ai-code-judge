import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="home-page">
      <header className="home-hero">
        <div>
          <span className="hero-pill">AI-driven coding judge</span>
          <h1>Practice smarter, code faster, and build confidence with every submission.</h1>
          <p>
            AI Code Judge is your platform for real-time coding practice, instant feedback, leaderboard competition,
            and secure admin problem management.
          </p>
          <div className="home-actions">
            <Link to="/problems" className="button button-primary">
              Explore Problems
            </Link>
            <Link to="/register" className="button button-secondary">
              Create Account
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <h2>Score leaderboard</h2>
            <p>Track your progress, compare with peers, and unlock higher ranks as you solve more problems.</p>
          </div>
          <div className="visual-card accent-card">
            <h2>Admin builder</h2>
            <p>Upload question sets, define test cases, and manage all problem types from a single admin hub.</p>
          </div>
        </div>
      </header>

      <section className="home-features">
        <article className="feature-card">
          <h3>AI Feedback</h3>
          <p>Receive AI-powered suggestions and complexity analysis after each submission.</p>
        </article>
        <article className="feature-card">
          <h3>Multiple question types</h3>
          <p>Support for Coding, Multiple Choice, Debugging, and Algorithm challenge formats.</p>
        </article>
        <article className="feature-card">
          <h3>Intuitive admin tools</h3>
          <p>Upload JSON problem batches, add test cases, and publish challenges instantly.</p>
        </article>
      </section>

      <section className="home-section home-highlight">
        <div>
          <h2>Designed for learners and educators</h2>
          <p>
            Whether you're preparing for interviews or running a coding course, AI Code Judge gives you a sleek,
            responsive dashboard, secure submissions, and beautiful interaction workflows.
          </p>
        </div>
        <div className="home-grid">
          <div className="feature-card">
            <h3>Elegant UI</h3>
            <p>Dark theme, polished cards, and step-by-step forms make every screen feel premium.</p>
          </div>
          <div className="feature-card">
            <h3>Fast workflow</h3>
            <p>Jump from problem selection to code execution in seconds with modern React navigation.</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;
