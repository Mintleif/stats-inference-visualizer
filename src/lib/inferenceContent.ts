import type { InferenceExample, ReferenceCard } from "./types";

export const mleExamples: InferenceExample[] = [
  {
    id: "mle-bernoulli",
    title: "Bernoulli(p)",
    context: "One observation is 0 or 1. Estimate the success probability p.",
    steps: [
      { title: "Likelihood", math: "L(p)=\\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i}=p^{\\sum x_i}(1-p)^{n-\\sum x_i}", explanation: "Group all successes and failures." },
      { title: "Log-likelihood", math: "\\ell(p)=\\left(\\sum x_i\\right)\\log p+\\left(n-\\sum x_i\\right)\\log(1-p)", explanation: "Logs make the product easier to differentiate." },
      { title: "Differentiate", math: "\\ell'(p)=\\frac{\\sum x_i}{p}-\\frac{n-\\sum x_i}{1-p}", explanation: "Differentiate with respect to p." },
      { title: "Set derivative to zero", math: "\\frac{\\sum x_i}{p}=\\frac{n-\\sum x_i}{1-p}", explanation: "Solve the score equation." },
      { title: "Solve", math: "\\hat p=\\frac{\\sum_{i=1}^n x_i}{n}=\\bar X", explanation: "The MLE is the sample proportion." }
    ],
    result: "\\hat p=\\bar X"
  },
  {
    id: "mle-binomial",
    title: "Binomial(m, p)",
    context: "Each observation is a count out of known m trials. Estimate p.",
    steps: [
      { title: "Likelihood", math: "L(p)=\\prod_{i=1}^n\\binom{m}{x_i}p^{x_i}(1-p)^{m-x_i}", explanation: "The binomial coefficients are constant with respect to p." },
      { title: "Log-likelihood", math: "\\ell(p)=C+\\left(\\sum x_i\\right)\\log p+\\left(nm-\\sum x_i\\right)\\log(1-p)", explanation: "C contains terms that do not affect the maximizing p." },
      { title: "Differentiate", math: "\\ell'(p)=\\frac{\\sum x_i}{p}-\\frac{nm-\\sum x_i}{1-p}", explanation: "Total trials are nm." },
      { title: "Solve", math: "\\hat p=\\frac{\\sum_{i=1}^n x_i}{nm}", explanation: "Total successes divided by total trials." }
    ],
    result: "\\hat p=\\frac{\\sum x_i}{nm}"
  },
  {
    id: "mle-poisson",
    title: "Poisson(lambda)",
    context: "Counts with unknown event rate lambda.",
    steps: [
      { title: "Likelihood", math: "L(\\lambda)=\\prod_{i=1}^n e^{-\\lambda}\\frac{\\lambda^{x_i}}{x_i!}", explanation: "Multiply the Poisson probabilities." },
      { title: "Log-likelihood", math: "\\ell(\\lambda)=-n\\lambda+\\left(\\sum x_i\\right)\\log\\lambda-\\sum\\log(x_i!)", explanation: "The factorial term is constant in lambda." },
      { title: "Differentiate", math: "\\ell'(\\lambda)=-n+\\frac{\\sum x_i}{\\lambda}", explanation: "Only the first two terms remain." },
      { title: "Solve", math: "-n+\\frac{\\sum x_i}{\\lambda}=0\\Rightarrow\\hat\\lambda=\\bar X", explanation: "The sample mean estimates the Poisson rate." }
    ],
    result: "\\hat\\lambda=\\bar X"
  },
  {
    id: "mle-exponential",
    title: "Exponential(theta), scale form",
    context: "Density is f(x)=theta^{-1}e^{-x/theta}. Estimate theta.",
    steps: [
      { title: "Likelihood", math: "L(\\theta)=\\prod_{i=1}^n\\frac{1}{\\theta}e^{-x_i/\\theta}=\\theta^{-n}e^{-\\sum x_i/\\theta}", explanation: "This uses scale theta, not rate lambda." },
      { title: "Log-likelihood", math: "\\ell(\\theta)=-n\\log\\theta-\\frac{1}{\\theta}\\sum x_i", explanation: "Longer waits imply a larger scale." },
      { title: "Differentiate", math: "\\ell'(\\theta)=-\\frac{n}{\\theta}+\\frac{\\sum x_i}{\\theta^2}", explanation: "The derivative of -S/theta is +S/theta squared." },
      { title: "Solve", math: "-\\frac{n}{\\theta}+\\frac{\\sum x_i}{\\theta^2}=0\\Rightarrow \\hat\\theta=\\bar X", explanation: "Average waiting time estimates scale." }
    ],
    result: "\\hat\\theta=\\bar X"
  },
  {
    id: "mle-gamma-scale",
    title: "Gamma(alpha, beta), alpha known, scale beta unknown",
    context: "Density is x^{alpha-1}e^{-x/beta}/(beta^alpha Gamma(alpha)).",
    steps: [
      { title: "Likelihood", math: "L(\\beta)=\\prod_{i=1}^n\\frac{x_i^{\\alpha-1}e^{-x_i/\\beta}}{\\beta^\\alpha\\Gamma(\\alpha)}", explanation: "Treat alpha as known." },
      { title: "Log-likelihood", math: "\\ell(\\beta)=C-n\\alpha\\log\\beta-\\frac{1}{\\beta}\\sum x_i", explanation: "C collects terms that do not involve beta." },
      { title: "Differentiate", math: "\\ell'(\\beta)=-\\frac{n\\alpha}{\\beta}+\\frac{\\sum x_i}{\\beta^2}", explanation: "This mirrors the exponential scale derivative." },
      { title: "Solve", math: "\\hat\\beta=\\frac{\\sum x_i}{n\\alpha}=\\frac{\\bar X}{\\alpha}", explanation: "Scale is sample mean divided by shape." }
    ],
    result: "\\hat\\beta=\\bar X/\\alpha"
  },
  {
    id: "mle-beta",
    title: "Beta(alpha, beta)",
    context: "Both shape parameters usually require numerical solution.",
    steps: [
      { title: "Log-likelihood", math: "\\ell(\\alpha,\\beta)=n\\log\\Gamma(\\alpha+\\beta)-n\\log\\Gamma(\\alpha)-n\\log\\Gamma(\\beta)+(\\alpha-1)\\sum\\log x_i+(\\beta-1)\\sum\\log(1-x_i)", explanation: "This uses the gamma-function form of the beta density." },
      { title: "Score equations", math: "\\psi(\\alpha)-\\psi(\\alpha+\\beta)=\\overline{\\log X},\\qquad \\psi(\\beta)-\\psi(\\alpha+\\beta)=\\overline{\\log(1-X)}", explanation: "psi is the derivative of log Gamma." },
      { title: "Solve numerically", math: "(\\hat\\alpha,\\hat\\beta)\\text{ solve the two equations above}", explanation: "There is no simple closed form." }
    ],
    result: "(\\hat\\alpha,\\hat\\beta)\\text{ are found numerically}"
  },
  {
    id: "mle-normal-known",
    title: "Normal(mu, known sigma squared)",
    context: "Variance is known; estimate only mu.",
    steps: [
      { title: "Likelihood", math: "L(\\mu)=\\prod_{i=1}^n\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2\\sigma^2}(x_i-\\mu)^2}", explanation: "Only the squared residuals involve mu." },
      { title: "Log-likelihood", math: "\\ell(\\mu)=-n\\log(\\sigma\\sqrt{2\\pi})-\\frac{1}{2\\sigma^2}\\sum_{i=1}^n(x_i-\\mu)^2", explanation: "Keep the constant term visible, then ignore it for differentiation." },
      { title: "Differentiate", math: "\\ell'(\\mu)=-\\frac{1}{2\\sigma^2}\\sum 2(x_i-\\mu)(-1)=\\frac{1}{\\sigma^2}\\sum(x_i-\\mu)", explanation: "Chain rule cancels the negative sign." },
      { title: "Solve", math: "\\sum(x_i-\\mu)=0\\Rightarrow \\hat\\mu=\\bar X", explanation: "The mean balances residuals." }
    ],
    result: "\\hat\\mu=\\bar X"
  },
  {
    id: "mle-normal-unknown",
    title: "Normal(mu, sigma squared unknown)",
    context: "Estimate both mu and sigma squared.",
    steps: [
      { title: "Likelihood", math: "L(\\mu,\\sigma^2)=\\prod_{i=1}^n\\frac{1}{\\sqrt{\\sigma^2}\\sqrt{2\\pi}}e^{-\\frac{1}{2\\sigma^2}(x_i-\\mu)^2}", explanation: "Writing sigma squared directly makes the variance derivative clearer." },
      { title: "Log-likelihood", math: "\\ell(\\mu,\\sigma^2)=-\\frac{n}{2}\\log(2\\pi)-\\frac{n}{2}\\log(\\sigma^2)-\\frac{1}{2\\sigma^2}\\sum(x_i-\\mu)^2", explanation: "This is the full log-likelihood." },
      { title: "Differentiate with respect to mu", math: "\\frac{\\partial\\ell}{\\partial\\mu}=\\frac{1}{\\sigma^2}\\sum(x_i-\\mu)=0\\Rightarrow \\hat\\mu=\\bar X", explanation: "The MLE for mu is still the sample mean." },
      { title: "Differentiate with respect to sigma squared", math: "\\frac{\\partial}{\\partial\\sigma^2}\\left[-\\frac{1}{2\\sigma^2}\\sum(x_i-\\mu)^2\\right]=\\frac{1}{2(\\sigma^2)^2}\\sum(x_i-\\mu)^2", explanation: "Differentiating 1/sigma squared gives -1/(sigma squared)^2; the outside negative makes the term positive." },
      { title: "Set equal to zero", math: "-\\frac{n}{2\\sigma^2}+\\frac{1}{2(\\sigma^2)^2}\\sum(x_i-\\bar X)^2=0", explanation: "Plug in mu hat equals x bar." },
      { title: "Solve", math: "\\hat\\sigma^2=\\frac{1}{n}\\sum_{i=1}^n(x_i-\\bar X)^2", explanation: "The MLE divides by n, not n - 1." }
    ],
    result: "\\hat\\mu=\\bar X,\\quad \\hat\\sigma^2=\\frac{1}{n}\\sum(x_i-\\bar X)^2"
  },
  {
    id: "mle-empirical",
    title: "Empirical distribution",
    context: "Nonparametric MLE for an unknown distribution.",
    steps: [
      { title: "Candidate distribution", math: "\\hat P(X=x_i)=\\frac{1}{n}", explanation: "Put equal mass on each observed data point." },
      { title: "Empirical CDF", math: "\\hat F_n(x)=\\frac{1}{n}\\sum_{i=1}^n\\mathbf{1}\\{X_i\\le x\\}", explanation: "The CDF is a step function." },
      { title: "Interpretation", math: "\\hat F_n\\text{ maximizes the nonparametric likelihood over all distributions.}", explanation: "Without assuming a family, the best-supported distribution is the observed one." }
    ],
    result: "\\hat F_n(x)=\\frac{1}{n}\\sum_{i=1}^n\\mathbf{1}\\{X_i\\le x\\}"
  }
];

export const fisherExamples: InferenceExample[] = [
  {
    id: "fisher-bernoulli",
    title: "Bernoulli(p)",
    context: "Use one observation first, then multiply information by n.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(p)=\\log f(X;p)=X\\log p+(1-X)\\log(1-p)", explanation: "This is the single-observation log PMF." },
      { title: "lambda prime", math: "\\lambda'(p)=\\frac{X}{p}-\\frac{1-X}{1-p}", explanation: "Differentiate with respect to p." },
      { title: "lambda double prime", math: "\\lambda''(p)=-\\frac{X}{p^2}-\\frac{1-X}{(1-p)^2}", explanation: "Differentiate again." },
      { title: "Information", math: "I(p)=-E[\\lambda''(p)]=\\frac{1}{p}+\\frac{1}{1-p}=\\frac{1}{p(1-p)}", explanation: "Use E(X)=p." },
      { title: "n observations", math: "I_n(p)=\\frac{n}{p(1-p)}", explanation: "Information adds for iid observations." }
    ],
    result: "I_n(p)=\\frac{n}{p(1-p)}"
  },
  {
    id: "fisher-binomial",
    title: "Binomial(m, p)",
    context: "One observation is a count out of m trials.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(p)=C+X\\log p+(m-X)\\log(1-p)", explanation: "C is the log binomial coefficient." },
      { title: "lambda prime", math: "\\lambda'(p)=\\frac{X}{p}-\\frac{m-X}{1-p}", explanation: "Only p terms matter." },
      { title: "lambda double prime", math: "\\lambda''(p)=-\\frac{X}{p^2}-\\frac{m-X}{(1-p)^2}", explanation: "Second derivative for one count." },
      { title: "Information", math: "I(p)=-E[\\lambda''(p)]=\\frac{m}{p(1-p)}", explanation: "Use E(X)=mp." },
      { title: "n observations", math: "I_n(p)=\\frac{nm}{p(1-p)}", explanation: "There are n independent counts." }
    ],
    result: "I_n(p)=\\frac{nm}{p(1-p)}"
  },
  {
    id: "fisher-poisson",
    title: "Poisson(lambda)",
    context: "Counts with rate lambda.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(\\lambda)=-\\lambda+X\\log\\lambda-\\log(X!)", explanation: "This is the log PMF for one observation." },
      { title: "lambda prime", math: "\\lambda'(\\lambda)=-1+\\frac{X}{\\lambda}", explanation: "Differentiate with respect to lambda." },
      { title: "lambda double prime", math: "\\lambda''(\\lambda)=-\\frac{X}{\\lambda^2}", explanation: "The second derivative is negative." },
      { title: "Information", math: "I(\\lambda)=-E[\\lambda''(\\lambda)]=\\frac{E(X)}{\\lambda^2}=\\frac{1}{\\lambda}", explanation: "Use E(X)=lambda." },
      { title: "n observations", math: "I_n(\\lambda)=\\frac{n}{\\lambda}", explanation: "Multiply one-observation information by n." }
    ],
    result: "I_n(\\lambda)=\\frac{n}{\\lambda}"
  },
  {
    id: "fisher-exponential",
    title: "Exponential(theta), scale form",
    context: "Density is theta^{-1}e^{-x/theta}.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(\\theta)=-\\log\\theta-\\frac{X}{\\theta}", explanation: "Single-observation log density." },
      { title: "lambda prime", math: "\\lambda'(\\theta)=-\\frac{1}{\\theta}+\\frac{X}{\\theta^2}", explanation: "Differentiate with respect to theta." },
      { title: "lambda double prime", math: "\\lambda''(\\theta)=\\frac{1}{\\theta^2}-\\frac{2X}{\\theta^3}", explanation: "Differentiate the score." },
      { title: "Information", math: "I(\\theta)=-E[\\lambda''(\\theta)]=-\\left(\\frac{1}{\\theta^2}-\\frac{2E(X)}{\\theta^3}\\right)=\\frac{1}{\\theta^2}", explanation: "Use E(X)=theta." },
      { title: "n observations", math: "I_n(\\theta)=\\frac{n}{\\theta^2}", explanation: "Information grows linearly in n." }
    ],
    result: "I_n(\\theta)=\\frac{n}{\\theta^2}"
  },
  {
    id: "fisher-normal",
    title: "Normal(mu), sigma squared known",
    context: "Estimate mu when sigma squared is known.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(\\mu)=C-\\frac{(X-\\mu)^2}{2\\sigma^2}", explanation: "C does not involve mu." },
      { title: "lambda prime", math: "\\lambda'(\\mu)=\\frac{X-\\mu}{\\sigma^2}", explanation: "Differentiate the squared residual." },
      { title: "lambda double prime", math: "\\lambda''(\\mu)=-\\frac{1}{\\sigma^2}", explanation: "The second derivative is constant." },
      { title: "Information", math: "I(\\mu)=-E[\\lambda''(\\mu)]=\\frac{1}{\\sigma^2}", explanation: "No expectation work is needed because it is constant." },
      { title: "n observations", math: "I_n(\\mu)=\\frac{n}{\\sigma^2}", explanation: "More observations add information." }
    ],
    result: "I_n(\\mu)=\\frac{n}{\\sigma^2}"
  },
  {
    id: "fisher-gamma-scale",
    title: "Gamma(alpha, beta), alpha known",
    context: "Estimate scale beta with alpha known.",
    steps: [
      { title: "lambda(theta)", math: "\\lambda(\\beta)=C-\\alpha\\log\\beta-\\frac{X}{\\beta}", explanation: "C does not involve beta." },
      { title: "lambda prime", math: "\\lambda'(\\beta)=-\\frac{\\alpha}{\\beta}+\\frac{X}{\\beta^2}", explanation: "Same shape as exponential, with alpha in the log term." },
      { title: "lambda double prime", math: "\\lambda''(\\beta)=\\frac{\\alpha}{\\beta^2}-\\frac{2X}{\\beta^3}", explanation: "Differentiate again." },
      { title: "Information", math: "I(\\beta)=-E[\\lambda''(\\beta)]=-\\left(\\frac{\\alpha}{\\beta^2}-\\frac{2E(X)}{\\beta^3}\\right)=\\frac{\\alpha}{\\beta^2}", explanation: "Use E(X)=alpha beta." },
      { title: "n observations", math: "I_n(\\beta)=\\frac{n\\alpha}{\\beta^2}", explanation: "Multiply by n." }
    ],
    result: "I_n(\\beta)=\\frac{n\\alpha}{\\beta^2}"
  }
];

export const crlbExamples: InferenceExample[] = [
  {
    id: "crlb-bernoulli",
    title: "Bernoulli(p)",
    context: "Estimator is p hat = X bar.",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(p)}=\\frac{p(1-p)}{n}", explanation: "Use I(p)=1/[p(1-p)]." },
      { title: "Estimator variance", math: "\\operatorname{Var}(\\bar X)=\\operatorname{Var}\\left(\\frac{1}{n}\\sum X_i\\right)=\\frac{1}{n^2}\\sum\\operatorname{Var}(X_i)", explanation: "Independence makes covariance terms zero." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\cdot n p(1-p)=\\frac{p(1-p)}{n}", explanation: "For Bernoulli, Var(X)=p(1-p)." },
      { title: "Compare", math: "\\operatorname{Var}(\\bar X)=\\operatorname{CRLB}", explanation: "It reaches the bound." }
    ],
    result: "\\bar X\\text{ is efficient for }p"
  },
  {
    id: "crlb-binomial",
    title: "Binomial(m, p)",
    context: "Estimator is p hat = sum X_i/(nm).",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(p)}=\\frac{p(1-p)}{nm}", explanation: "Use one-count information I(p)=m/[p(1-p)]." },
      { title: "Estimator variance", math: "\\operatorname{Var}\\left(\\frac{\\sum X_i}{nm}\\right)=\\frac{1}{n^2m^2}\\sum\\operatorname{Var}(X_i)", explanation: "Scale the variance by the square of nm." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}\\left(\\frac{\\sum X_i}{nm}\\right)=\\frac{1}{n^2m^2}\\cdot nmp(1-p)=\\frac{p(1-p)}{nm}", explanation: "For Binomial(m,p), Var(X)=mp(1-p)." },
      { title: "Compare", math: "\\operatorname{Var}(\\hat p)=\\operatorname{CRLB}", explanation: "The total success proportion reaches the bound." }
    ],
    result: "\\hat p=\\frac{\\sum X_i}{nm}\\text{ is efficient for }p"
  },
  {
    id: "crlb-poisson",
    title: "Poisson(lambda)",
    context: "Estimator is lambda hat = X bar.",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(\\lambda)}=\\frac{\\lambda}{n}", explanation: "Use I(lambda)=1/lambda." },
      { title: "Estimator variance", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\sum\\operatorname{Var}(X_i)", explanation: "Use independence." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\cdot n\\lambda=\\frac{\\lambda}{n}", explanation: "For Poisson, Var(X)=lambda." },
      { title: "Compare", math: "\\operatorname{Var}(\\bar X)=\\operatorname{CRLB}", explanation: "The sample mean reaches the bound." }
    ],
    result: "\\bar X\\text{ is efficient for }\\lambda"
  },
  {
    id: "crlb-exponential",
    title: "Exponential(theta), scale form",
    context: "Estimator is theta hat = X bar.",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(\\theta)}=\\frac{\\theta^2}{n}", explanation: "Use I(theta)=1/theta squared." },
      { title: "Estimator variance", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\sum\\operatorname{Var}(X_i)", explanation: "Average of iid observations." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\cdot n\\theta^2=\\frac{\\theta^2}{n}", explanation: "For Exponential scale theta, Var(X)=theta squared." },
      { title: "Compare", math: "\\operatorname{Var}(\\bar X)=\\operatorname{CRLB}", explanation: "The average waiting time reaches the bound." }
    ],
    result: "\\bar X\\text{ is efficient for }\\theta"
  },
  {
    id: "crlb-normal",
    title: "Normal(mu), sigma squared known",
    context: "Estimator is mu hat = X bar.",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(\\mu)}=\\frac{\\sigma^2}{n}", explanation: "Use I(mu)=1/sigma squared." },
      { title: "Estimator variance", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\sum\\operatorname{Var}(X_i)", explanation: "Average independent normal observations." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}(\\bar X)=\\frac{1}{n^2}\\cdot n\\sigma^2=\\frac{\\sigma^2}{n}", explanation: "For Normal(mu,sigma squared), Var(X)=sigma squared." },
      { title: "Compare", math: "\\operatorname{Var}(\\bar X)=\\operatorname{CRLB}", explanation: "The sample mean reaches the bound." }
    ],
    result: "\\bar X\\text{ is efficient for }\\mu"
  },
  {
    id: "crlb-gamma-scale",
    title: "Gamma(alpha, beta), alpha known",
    context: "Estimator is beta hat = X bar / alpha.",
    steps: [
      { title: "CRLB", math: "\\operatorname{CRLB}=\\frac{1}{nI(\\beta)}=\\frac{\\beta^2}{n\\alpha}", explanation: "Use I(beta)=alpha/beta squared." },
      { title: "Estimator variance", math: "\\operatorname{Var}\\left(\\frac{\\bar X}{\\alpha}\\right)=\\frac{1}{\\alpha^2}\\operatorname{Var}(\\bar X)", explanation: "Scale variance by 1/alpha squared." },
      { title: "Substitute Var(X)", math: "\\operatorname{Var}\\left(\\frac{\\bar X}{\\alpha}\\right)=\\frac{1}{\\alpha^2}\\cdot\\frac{\\alpha\\beta^2}{n}=\\frac{\\beta^2}{n\\alpha}", explanation: "For Gamma(alpha,beta), Var(X)=alpha beta squared." },
      { title: "Compare", math: "\\operatorname{Var}(\\hat\\beta)=\\operatorname{CRLB}", explanation: "The estimator reaches the bound when alpha is known." }
    ],
    result: "\\hat\\beta=\\bar X/\\alpha\\text{ is efficient for }\\beta"
  }
];

export const mvueExamples: InferenceExample[] = [
  {
    id: "mvue-crlb",
    title: "MVUE by CRLB equality",
    context: "Fast route: prove unbiasedness and show variance equals the CRLB.",
    steps: [
      { title: "Unbiasedness", math: "E(\\hat\\theta)=\\theta", explanation: "The estimator targets the parameter on average." },
      { title: "CRLB equality", math: "\\operatorname{Var}(\\hat\\theta)=\\frac{1}{nI(\\theta)}", explanation: "No unbiased estimator can have smaller variance." },
      { title: "Conclusion", math: "\\hat\\theta\\text{ is efficient and MVUE}", explanation: "This proves minimum variance among unbiased estimators." }
    ],
    result: "\\operatorname{Var}(\\hat\\theta)=\\operatorname{CRLB}\\Rightarrow\\hat\\theta\\text{ is MVUE}"
  },
  {
    id: "mvue-lehmann",
    title: "Lehmann-Scheffe method",
    context: "Use exponential family form, factorization, completeness, and unbiasedness.",
    steps: [
      { title: "Show exponential family form", math: "f(x;\\theta)=a(\\theta)b(x)e^{c(\\theta)d(x)}", explanation: "Identify a(theta), b(x), c(theta), and d(x)." },
      { title: "Build iid likelihood", math: "L(\\theta;\\underline{x})=\\prod_{i=1}^n a(\\theta)b(x_i)e^{c(\\theta)d(x_i)}=\\left[\\prod b(x_i)\\right]a(\\theta)^n e^{c(\\theta)\\sum d(x_i)}", explanation: "The underlined x means the whole sample vector." },
      { title: "Apply FFC", math: "L(\\theta;\\underline{x})=u(\\underline{x})v(T,\\theta),\\quad T=\\sum_{i=1}^n d(X_i)", explanation: "By the Fisher-Factorization Criterion, T is sufficient." },
      { title: "Completeness", math: "X_1,\\ldots,X_n\\overset{iid}{\\sim}f(x;\\theta)\\text{ in a full one-parameter exponential family}\\Rightarrow T=\\sum d(X_i)\\text{ is complete sufficient}", explanation: "This is the standard completeness result used in many exam proofs." },
      { title: "Use an unbiased function of T", math: "\\hat\\theta=g(T),\\quad E(\\hat\\theta)=\\theta", explanation: "If X bar is one-to-one with T/n, using X bar is equivalent to using T." },
      { title: "Lehmann-Scheffe theorem", math: "\\hat\\theta\\text{ unbiased and a function of complete sufficient }T\\Rightarrow\\hat\\theta\\text{ is MVUE}", explanation: "This gives uniqueness among unbiased estimators." }
    ],
    result: "\\hat\\theta\\text{ is MVUE by Lehmann-Scheffe}"
  }
];

export const lrtExamples: InferenceExample[] = [
  {
    id: "lrt-bernoulli-binomial",
    title: "Bernoulli/Binomial p: p1 > p0",
    context: "Best test of size alpha for H0:p=p0 vs H1:p=p1.",
    steps: [
      { title: "Neyman-Pearson setup", math: "H_0:p=p_0,\\quad H_1:p=p_1,\\quad p_1>p_0", explanation: "Use the likelihood ratio for simple vs simple hypotheses." },
      { title: "Likelihood ratio", math: "\\frac{f_n(\\underline{x};p_1)}{f_n(\\underline{x};p_0)}>c", explanation: "Reject H0 when the data are much more likely under H1." },
      { title: "Compute ratio", math: "\\frac{p_1^{\\sum x_i}(1-p_1)^{n-\\sum x_i}}{p_0^{\\sum x_i}(1-p_0)^{n-\\sum x_i}}>c", explanation: "For Binomial counts, replace n by total trials as needed." },
      { title: "Group powers", math: "\\left(\\frac{p_1(1-p_0)}{p_0(1-p_1)}\\right)^{\\sum x_i}\\left(\\frac{1-p_1}{1-p_0}\\right)^n>c", explanation: "Only sum x_i changes with the data." },
      { title: "Use p1 > p0", math: "\\frac{p_1(1-p_0)}{p_0(1-p_1)}>1\\Rightarrow \\sum x_i>k", explanation: "Taking logs preserves the direction after dividing by a positive log." },
      { title: "Conclusion", math: "\\text{Reject }H_0\\text{ if }\\sum_{i=1}^n X_i>k", explanation: "Choose k using the null distribution." }
    ],
    result: "\\text{Reject }H_0\\text{ for large }\\sum X_i"
  },
  {
    id: "lrt-poisson",
    title: "Poisson lambda: lambda1 > lambda0",
    context: "Large total counts support the larger rate.",
    steps: [
      { title: "Hypotheses", math: "H_0:\\lambda=\\lambda_0,\\quad H_1:\\lambda=\\lambda_1,\\quad \\lambda_1>\\lambda_0", explanation: "Both hypotheses are simple." },
      { title: "Likelihood ratio", math: "\\frac{f_n(\\underline{x};\\lambda_1)}{f_n(\\underline{x};\\lambda_0)}=e^{-n(\\lambda_1-\\lambda_0)}\\left(\\frac{\\lambda_1}{\\lambda_0}\\right)^{\\sum x_i}", explanation: "The factorial terms cancel." },
      { title: "Simplify", math: "\\lambda_1>\\lambda_0\\Rightarrow \\frac{\\lambda_1}{\\lambda_0}>1\\Rightarrow \\sum X_i>k", explanation: "The likelihood ratio increases with the total count." },
      { title: "Choose k", math: "P_{\\lambda_0}\\left(\\sum X_i>k\\right)=\\alpha,\\quad \\sum X_i\\sim\\operatorname{Poisson}(n\\lambda_0)\\text{ under }H_0", explanation: "Use exact Poisson tails or a normal approximation." }
    ],
    result: "\\text{Reject }H_0\\text{ if }\\sum X_i>k"
  },
  {
    id: "lrt-exponential",
    title: "Exponential scale theta: theta1 > theta0",
    context: "Long total waiting time supports the larger scale.",
    steps: [
      { title: "Hypotheses", math: "H_0:\\theta=\\theta_0,\\quad H_1:\\theta=\\theta_1,\\quad \\theta_1>\\theta_0", explanation: "Theta is the scale parameter." },
      { title: "Likelihood ratio", math: "\\frac{f_n(\\underline{x};\\theta_1)}{f_n(\\underline{x};\\theta_0)}=\\left(\\frac{\\theta_0}{\\theta_1}\\right)^n e^{-\\sum x_i(1/\\theta_1-1/\\theta_0)}", explanation: "Use the scale-form exponential likelihood." },
      { title: "Simplify", math: "\\theta_1>\\theta_0\\Rightarrow \\frac{1}{\\theta_1}-\\frac{1}{\\theta_0}<0\\Rightarrow \\sum X_i>k", explanation: "Larger sums make H1 more likely." },
      { title: "Choose k", math: "P_{\\theta_0}\\left(\\sum X_i>k\\right)=\\alpha,\\quad \\sum X_i\\sim\\operatorname{Gamma}(n,\\theta_0)\\text{ under }H_0", explanation: "Use exact gamma tails or a large-sample normal approximation." }
    ],
    result: "\\text{Reject }H_0\\text{ if }\\sum X_i>k"
  },
  {
    id: "lrt-normal",
    title: "Normal mean mu: mu1 > mu0, sigma squared known",
    context: "Large sample sums support the larger mean.",
    steps: [
      { title: "Hypotheses", math: "H_0:\\mu=\\mu_0,\\quad H_1:\\mu=\\mu_1,\\quad \\mu_1>\\mu_0", explanation: "Variance is assumed known." },
      { title: "Log likelihood ratio", math: "\\log LR=\\frac{\\mu_1-\\mu_0}{\\sigma^2}\\sum x_i-\\frac{n(\\mu_1^2-\\mu_0^2)}{2\\sigma^2}", explanation: "Common normal constants cancel." },
      { title: "Simplify", math: "\\mu_1>\\mu_0\\Rightarrow \\sum X_i>k", explanation: "The log likelihood ratio increases with the sample sum." },
      { title: "Choose k", math: "P_{\\mu_0}\\left(\\sum X_i>k\\right)=\\alpha,\\quad \\sum X_i\\sim N(n\\mu_0,n\\sigma^2)\\text{ under }H_0", explanation: "The null distribution is exactly normal." }
    ],
    result: "\\text{Reject }H_0\\text{ if }\\sum X_i>k"
  },
  {
    id: "lrt-critical-k",
    title: "Finding k: exact and large-sample example",
    context: "Example: n=40, alpha=0.05, H0:p=0.5 vs H1:p=0.7.",
    steps: [
      { title: "Under H0", math: "\\sum X_i\\mid H_0\\sim\\operatorname{Binomial}(40,0.5)", explanation: "Critical values are always chosen under H0." },
      { title: "Exact small-sample rule", math: "P_{0.5}\\left(\\sum X_i>k\\right)\\le 0.05", explanation: "Use the exact binomial tail if n is small." },
      { title: "CLT approximation", math: "\\sum X_i\\approx N(np,npq)=N(20,10)", explanation: "Here np=20 and npq=10." },
      { title: "Solve", math: "P\\left(\\sum X_i>k\\right)=0.05\\Rightarrow\\frac{k-20}{\\sqrt{10}}=1.645", explanation: "1.645 is the upper 5 percent standard normal cutoff." },
      { title: "Critical value", math: "k=20+1.645\\sqrt{10}", explanation: "Round carefully for an integer-valued statistic." }
    ],
    result: "k\\approx20+1.645\\sqrt{10}"
  }
];

export const smallLargeExamples: InferenceExample[] = [
  {
    id: "small-large",
    title: "Small sample vs large sample estimation",
    context: "Small samples prefer exact distributions when available; large samples use asymptotic normality.",
    steps: [
      { title: "Small sample normal mean", math: "\\frac{\\bar X-\\mu}{S/\\sqrt n}\\sim t_{n-1}", explanation: "Use t when data are normal and sigma is unknown." },
      { title: "Large sample MLE", math: "\\sqrt{n}(\\hat\\theta-\\theta)\\overset{d}{\\longrightarrow}N\\left(0,\\frac{1}{I(\\theta)}\\right)", explanation: "This is the asymptotic normality of the MLE." },
      { title: "Estimated standard error", math: "\\widehat{SE}(\\hat\\theta)=\\sqrt{\\frac{1}{I_n(\\hat\\theta)}}", explanation: "Plug theta hat into the information." },
      { title: "Approximate CI", math: "\\hat\\theta\\pm z_{\\alpha/2}\\widehat{SE}(\\hat\\theta)", explanation: "Use this for large-sample approximate confidence intervals." }
    ],
    result: "Use exact methods for small n; use asymptotic normality for large n."
  }
];

export const examCards: ReferenceCard[] = [
  { title: "Use Binomial", body: "Fixed number of independent success/failure trials with the same success probability." },
  { title: "Use Poisson", body: "Counts of independent events over a fixed time, area, or interval." },
  { title: "Use Exponential", body: "Waiting time until the next event; in scale form it is Gamma with alpha = 1." },
  { title: "Use Gamma", body: "Positive waiting-time totals or flexible right-skewed data." },
  { title: "Use Beta", body: "A distribution over probabilities or proportions between 0 and 1." },
  { title: "Use Empirical", body: "When the distribution is represented directly by the observed sample." },
  { title: "Use Normal approximation", body: "Binomial with large np and n(1-p), or sums/averages where CLT applies." },
  { title: "PDF vs PMF", body: "PMF gives probability at points for discrete variables. PDF gives density; probabilities are areas." },
  { title: "Bayesian vs Frequentist", body: "Bayesian updates a distribution for parameters. Frequentist treats parameters as fixed and studies estimator behavior." },
  { title: "MLE steps", body: "Write likelihood, take logs, differentiate, set equal to zero, solve, then check the parameter space." },
  { title: "Fisher Information steps", body: "lambda(theta)=log f(x;theta), lambda prime, lambda double prime, then I(theta)=-E[lambda double prime]." },
  { title: "CRLB steps", body: "Compute I(theta), use 1/(nI(theta)), compute estimator variance, compare." },
  { title: "Identify MVUE", body: "Use CRLB equality or Lehmann-Scheffe with complete sufficient statistics." },
  { title: "Likelihood ratio test", body: "Compute fn(x;theta1)/fn(x;theta0), simplify to a statistic, choose cutoff using H0." }
];
