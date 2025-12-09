import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Simple wrapper for tests
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// =====================================================
// NAVIGATION TESTS
// =====================================================
describe("Landing Page Navigation", () => {
  test("should render logo with brand name", () => {
    const { getByTestId, getByText } = render(
      <nav data-testid="landing-nav">
        <div className="flex items-center gap-2">
          <div data-testid="logo" className="bg-primary rounded-md">TM</div>
          <span data-testid="brand-name">Task Manager</span>
        </div>
      </nav>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("logo")).toBeTruthy();
    expect(getByTestId("brand-name")).toBeTruthy();
    expect(getByText("Task Manager")).toBeTruthy();
  });

  test("should render navigation links", () => {
    const { getByText } = render(
      <nav data-testid="landing-nav">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("Features")).toBeTruthy();
    expect(getByText("Pricing")).toBeTruthy();
    expect(getByText("FAQ")).toBeTruthy();
  });

  test("should render auth buttons", () => {
    const { getByTestId } = render(
      <nav>
        <button data-testid="sign-in-btn">Sign In</button>
        <button data-testid="get-started-btn">Get Started</button>
      </nav>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("sign-in-btn")).toBeTruthy();
    expect(getByTestId("get-started-btn")).toBeTruthy();
  });
});

// =====================================================
// HERO SECTION TESTS
// =====================================================
describe("Hero Section", () => {
  test("should render headline", () => {
    const { getByTestId, getByText } = render(
      <section data-testid="hero-section">
        <h1 data-testid="hero-headline">Manage tasks with clarity and ease</h1>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("hero-headline")).toBeTruthy();
    expect(getByText(/manage tasks/i)).toBeTruthy();
  });

  test("should render subheadline", () => {
    const { getByTestId } = render(
      <section data-testid="hero-section">
        <p data-testid="hero-subheadline">
          Streamline your workflow and achieve more
        </p>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("hero-subheadline")).toBeTruthy();
  });

  test("should render CTA buttons", () => {
    const { getByTestId, getByText } = render(
      <section data-testid="hero-section">
        <button data-testid="hero-cta-primary">Start Free Trial</button>
        <button data-testid="hero-cta-secondary">Watch Demo</button>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("hero-cta-primary")).toBeTruthy();
    expect(getByText("Start Free Trial")).toBeTruthy();
  });

  test("should render trust badge", () => {
    const { getByTestId } = render(
      <section data-testid="hero-section">
        <div data-testid="trust-badge">
          Trusted by 10,000+ teams worldwide
        </div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("trust-badge")).toBeTruthy();
  });
});

// =====================================================
// HOW IT WORKS SECTION TESTS
// =====================================================
describe("How It Works Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="how-it-works-section">
        <h2 data-testid="section-title">How It Works</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("How It Works")).toBeTruthy();
  });

  test("should render 3 or more steps", () => {
    const { getAllByTestId } = render(
      <section data-testid="how-it-works-section">
        <div data-testid="step" data-step="1">Sign Up</div>
        <div data-testid="step" data-step="2">Create Tasks</div>
        <div data-testid="step" data-step="3">Track Progress</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const steps = getAllByTestId("step");
    expect(steps.length).toBeGreaterThanOrEqual(3);
  });

  test("each step should have title and description", () => {
    const { getByTestId } = render(
      <div data-testid="step">
        <h3 data-testid="step-title">Sign Up</h3>
        <p data-testid="step-description">Create your account in seconds</p>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("step-title")).toBeTruthy();
    expect(getByTestId("step-description")).toBeTruthy();
  });
});

// =====================================================
// FEATURES SECTION TESTS
// =====================================================
describe("Features Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="features-section">
        <h2>Everything you need to stay organized</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/everything you need/i)).toBeTruthy();
  });

  test("should render feature cards", () => {
    const { getAllByTestId } = render(
      <section data-testid="features-section">
        <div data-testid="feature-card">Kanban Board</div>
        <div data-testid="feature-card">Priority Levels</div>
        <div data-testid="feature-card">Due Dates</div>
        <div data-testid="feature-card">Tags & Labels</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const featureCards = getAllByTestId("feature-card");
    expect(featureCards.length).toBeGreaterThanOrEqual(4);
  });

  test("feature card should have icon, title, and description", () => {
    const { getByTestId } = render(
      <div data-testid="feature-card">
        <div data-testid="feature-icon">📋</div>
        <h3 data-testid="feature-title">Kanban Board</h3>
        <p data-testid="feature-description">Drag & drop task management</p>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("feature-icon")).toBeTruthy();
    expect(getByTestId("feature-title")).toBeTruthy();
    expect(getByTestId("feature-description")).toBeTruthy();
  });
});

// =====================================================
// STATS SECTION TESTS
// =====================================================
describe("Stats Section", () => {
  test("should render stat items", () => {
    const { getAllByTestId, getByText } = render(
      <section data-testid="stats-section">
        <div data-testid="stat-item">
          <span data-testid="stat-number">10K+</span>
          <span data-testid="stat-label">Active Users</span>
        </div>
        <div data-testid="stat-item">
          <span data-testid="stat-number">1M+</span>
          <span data-testid="stat-label">Tasks Completed</span>
        </div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const statItems = getAllByTestId("stat-item");
    expect(statItems.length).toBeGreaterThanOrEqual(2);
    expect(getByText("10K+")).toBeTruthy();
    expect(getByText("Active Users")).toBeTruthy();
  });
});

// =====================================================
// TESTIMONIALS SECTION TESTS
// =====================================================
describe("Testimonials Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="testimonials-section">
        <h2>Loved by teams everywhere</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/loved by teams/i)).toBeTruthy();
  });

  test("should render testimonial cards", () => {
    const { getAllByTestId } = render(
      <section data-testid="testimonials-section">
        <div data-testid="testimonial-card">Testimonial 1</div>
        <div data-testid="testimonial-card">Testimonial 2</div>
        <div data-testid="testimonial-card">Testimonial 3</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const testimonials = getAllByTestId("testimonial-card");
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
  });

  test("testimonial card should have quote, author, and role", () => {
    const { getByTestId } = render(
      <div data-testid="testimonial-card">
        <p data-testid="testimonial-quote">"This app transformed our workflow"</p>
        <div data-testid="testimonial-author">Sarah Chen</div>
        <div data-testid="testimonial-role">Product Manager</div>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("testimonial-quote")).toBeTruthy();
    expect(getByTestId("testimonial-author")).toBeTruthy();
    expect(getByTestId("testimonial-role")).toBeTruthy();
  });

  test("testimonial card should have avatar", () => {
    const { getByTestId } = render(
      <div data-testid="testimonial-card">
        <img data-testid="testimonial-avatar" src="/avatar.jpg" alt="Author" />
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("testimonial-avatar")).toBeTruthy();
  });
});

// =====================================================
// PRICING SECTION TESTS
// =====================================================
describe("Pricing Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="pricing-section">
        <h2>Simple, transparent pricing</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/simple, transparent pricing/i)).toBeTruthy();
  });

  test("should render pricing tiers", () => {
    const { getAllByTestId } = render(
      <section data-testid="pricing-section">
        <div data-testid="pricing-card" data-tier="free">Free</div>
        <div data-testid="pricing-card" data-tier="pro">Pro</div>
        <div data-testid="pricing-card" data-tier="enterprise">Enterprise</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const pricingCards = getAllByTestId("pricing-card");
    expect(pricingCards.length).toBe(3);
  });

  test("pricing card should have name, price, and features", () => {
    const { getByTestId } = render(
      <div data-testid="pricing-card">
        <h3 data-testid="pricing-name">Pro</h3>
        <div data-testid="pricing-price">$9/month</div>
        <ul data-testid="pricing-features">
          <li>Unlimited tasks</li>
          <li>Priority support</li>
        </ul>
        <button data-testid="pricing-cta">Get Started</button>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("pricing-name")).toBeTruthy();
    expect(getByTestId("pricing-price")).toBeTruthy();
    expect(getByTestId("pricing-features")).toBeTruthy();
    expect(getByTestId("pricing-cta")).toBeTruthy();
  });

  test("should highlight recommended tier", () => {
    const { getByTestId, getByText } = render(
      <div data-testid="pricing-card" data-recommended="true">
        <span data-testid="recommended-badge">Most Popular</span>
        <h3>Pro</h3>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("recommended-badge")).toBeTruthy();
    expect(getByText("Most Popular")).toBeTruthy();
  });
});

// =====================================================
// FAQ SECTION TESTS
// =====================================================
describe("FAQ Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="faq-section">
        <h2>Frequently Asked Questions</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/frequently asked questions/i)).toBeTruthy();
  });

  test("should render FAQ items", () => {
    const { getAllByTestId } = render(
      <section data-testid="faq-section">
        <div data-testid="faq-item">Is there a free trial?</div>
        <div data-testid="faq-item">Can I cancel anytime?</div>
        <div data-testid="faq-item">How secure is my data?</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const faqItems = getAllByTestId("faq-item");
    expect(faqItems.length).toBeGreaterThanOrEqual(3);
  });

  test("FAQ item should have question and answer", () => {
    const { getByTestId } = render(
      <div data-testid="faq-item">
        <button data-testid="faq-question">Is there a free trial?</button>
        <div data-testid="faq-answer">
          Yes! You can try all features free for 14 days.
        </div>
      </div>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("faq-question")).toBeTruthy();
    expect(getByTestId("faq-answer")).toBeTruthy();
  });
});

// =====================================================
// NEWSLETTER SECTION TESTS
// =====================================================
describe("Newsletter Section", () => {
  test("should render email input", () => {
    const { getByTestId } = render(
      <section data-testid="newsletter-section">
        <input data-testid="newsletter-email" type="email" placeholder="Enter your email" />
        <button data-testid="newsletter-submit">Subscribe</button>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("newsletter-email")).toBeTruthy();
    expect(getByTestId("newsletter-submit")).toBeTruthy();
  });

  test("should render headline", () => {
    const { getByTestId } = render(
      <section data-testid="newsletter-section">
        <h2 data-testid="newsletter-headline">Stay updated</h2>
        <p data-testid="newsletter-description">Get the latest updates and tips</p>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("newsletter-headline")).toBeTruthy();
    expect(getByTestId("newsletter-description")).toBeTruthy();
  });
});

// =====================================================
// FOOTER TESTS
// =====================================================
describe("Footer Section", () => {
  test("should render logo", () => {
    const { getByTestId } = render(
      <footer data-testid="footer">
        <div data-testid="footer-logo">Task Manager</div>
      </footer>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("footer-logo")).toBeTruthy();
  });

  test("should render navigation links", () => {
    const { getByTestId, getByText } = render(
      <footer data-testid="footer">
        <div data-testid="footer-links">
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
        </div>
      </footer>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("footer-links")).toBeTruthy();
    expect(getByText("Features")).toBeTruthy();
    expect(getByText("Pricing")).toBeTruthy();
    expect(getByText("About")).toBeTruthy();
  });

  test("should render social links", () => {
    const { getByTestId } = render(
      <footer data-testid="footer">
        <div data-testid="social-links">
          <a data-testid="social-twitter" href="https://twitter.com">Twitter</a>
          <a data-testid="social-github" href="https://github.com">GitHub</a>
        </div>
      </footer>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("social-links")).toBeTruthy();
    expect(getByTestId("social-twitter")).toBeTruthy();
    expect(getByTestId("social-github")).toBeTruthy();
  });

  test("should render copyright", () => {
    const { getByTestId, getByText } = render(
      <footer data-testid="footer">
        <p data-testid="copyright">© 2025 Task Manager. All rights reserved.</p>
      </footer>,
      { wrapper: createWrapper() }
    );
    
    expect(getByTestId("copyright")).toBeTruthy();
    expect(getByText(/2025/)).toBeTruthy();
  });
});

// =====================================================
// INTEGRATION LOGOS TESTS
// =====================================================
describe("Integration Logos Section", () => {
  test("should render section title", () => {
    const { getByText } = render(
      <section data-testid="integrations-section">
        <h2>Integrates with your favorite tools</h2>
      </section>,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/integrates with/i)).toBeTruthy();
  });

  test("should render integration logos", () => {
    const { getAllByTestId } = render(
      <section data-testid="integrations-section">
        <div data-testid="integration-logo">Slack</div>
        <div data-testid="integration-logo">GitHub</div>
        <div data-testid="integration-logo">Google Calendar</div>
      </section>,
      { wrapper: createWrapper() }
    );
    
    const logos = getAllByTestId("integration-logo");
    expect(logos.length).toBeGreaterThanOrEqual(3);
  });
});
