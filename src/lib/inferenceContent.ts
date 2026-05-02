import type { InferenceExample, ReferenceCard } from "./types";

export const mleExamples: InferenceExample[] = [
  {
    id: "mle-bernoulli",
    title: "Bernoulli(p)",
    context: "Data are 0/1 outcomes. The unknown parameter is the success probability p.",
    steps: [
      {
        title: "Likelihood",
        math: "L(p)=\\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i}=p^{\\sum x_i}(1-p)^{n-\\sum x_i}",
        explanation: "Multiply the probability of each observed success and failure."
      },
      {
        title: "Log-likelihood",
        math: "\\ell(p)=\\left(\\sum x_i\\right)\\log p+\\left(n-\\sum x_i\\right)\\log(1-p)",
        explanation: "Logs turn products into sums and make differentiation easier."
      },
      {
        title: "Differentiate and solve",
        math: "\\frac{d\\ell}{dp}=\\frac{\\sum x_i}{p}-\\frac{n-\\sum x_i}{1-p}=0\\Rightarrow \\hat p=\\frac{\\sum x_i}{n}=\\bar X",
        explanation: "The MLE is the observed proportion of successes."
      }
    ],
    result: "\\hat p=\\bar X"
  },
  {
    id: "mle-binomial",
    title: "Binomial(n, p)",
    context: "Each observation is a count out of known trial size m. Estimate p.",
    steps: [
      {
        title: "Likelihood",
        math: "L(p)\\propto\\prod_{i=1}^n p^{x_i}(1-p)^{m-x_i}=p^{\\sum x_i}(1-p)^{nm-\\sum x_i}",
        explanation: "The combinatorial terms do not depend on p, so they can be ignored for maximization."
      },
      {
        title: "Score equation",
        math: "\\frac{d\\ell}{dp}=\\frac{\\sum x_i}{p}-\\frac{nm-\\sum x_i}{1-p}=0",
        explanation: "Set the derivative of the log-likelihood equal to zero."
      },
      {
        title: "Solve",
        math: "\\hat p=\\frac{\\sum_{i=1}^n x_i}{nm}",
        explanation: "Use total successes divided by total trials."
      }
    ],
    result: "\\hat p=\\frac{\\sum x_i}{nm}"
  },
  {
    id: "mle-poisson",
    title: "Poisson(lambda)",
    context: "Data are independent event counts with common rate lambda.",
    steps: [
      {
        title: "Likelihood",
        math: "L(\\lambda)=\\prod_{i=1}^n e^{-\\lambda}\\frac{\\lambda^{x_i}}{x_i!}",
        explanation: "Each count contributes one Poisson probability."
      },
      {
        title: "Log-likelihood",
        math: "\\ell(\\lambda)=-n\\lambda+\\left(\\sum x_i\\right)\\log\\lambda-\\sum\\log(x_i!)",
        explanation: "The factorial term is constant with respect to lambda."
      },
      {
        title: "Differentiate and solve",
        math: "\\frac{d\\ell}{d\\lambda}=-n+\\frac{\\sum x_i}{\\lambda}=0\\Rightarrow \\hat\\lambda=\\bar X",
        explanation: "For Poisson, the sample mean estimates both the mean and the rate."
      }
    ],
    result: "\\hat\\lambda=\\bar X"
  },
  {
    id: "mle-exponential",
    title: "Exponential(lambda)",
    context: "Data are waiting times. Larger lambda means shorter average waits.",
    steps: [
      {
        title: "Likelihood",
        math: "L(\\lambda)=\\prod_{i=1}^n \\lambda e^{-\\lambda x_i}=\\lambda^n e^{-\\lambda\\sum x_i}",
        explanation: "The product keeps one lambda per observation."
      },
      {
        title: "Log-likelihood",
        math: "\\ell(\\lambda)=n\\log\\lambda-\\lambda\\sum x_i",
        explanation: "The log-likelihood balances fit against the total waiting time."
      },
      {
        title: "Differentiate and solve",
        math: "\\frac{d\\ell}{d\\lambda}=\\frac{n}{\\lambda}-\\sum x_i=0\\Rightarrow \\hat\\lambda=\\frac{1}{\\bar X}",
        explanation: "If observed waits are long, the fitted rate becomes small."
      }
    ],
    result: "\\hat\\lambda=1/\\bar X"
  },
  {
    id: "mle-normal-known",
    title: "Normal(mu, known sigma^2)",
    context: "Variance is known, so estimate only the center mu.",
    steps: [
      {
        title: "Log-likelihood",
        math: "\\ell(\\mu)=C-\\frac{1}{2\\sigma^2}\\sum_{i=1}^n(x_i-\\mu)^2",
        explanation: "Maximizing the likelihood is the same as minimizing squared distance from mu."
      },
      {
        title: "Differentiate",
        math: "\\frac{d\\ell}{d\\mu}=\\frac{1}{\\sigma^2}\\sum_{i=1}^n(x_i-\\mu)",
        explanation: "The derivative measures whether mu is below or above the data center."
      },
      {
        title: "Solve",
        math: "\\sum(x_i-\\mu)=0\\Rightarrow \\hat\\mu=\\bar X",
        explanation: "The sample mean balances positive and negative residuals."
      }
    ],
    result: "\\hat\\mu=\\bar X"
  },
  {
    id: "mle-normal-unknown",
    title: "Normal(mu, sigma^2 unknown)",
    context: "Estimate both the mean and variance from the same sample.",
    steps: [
      {
        title: "Log-likelihood",
        math: "\\ell(\\mu,\\sigma^2)=-\\frac{n}{2}\\log(2\\pi)-\\frac{n}{2}\\log\\sigma^2-\\frac{1}{2\\sigma^2}\\sum(x_i-\\mu)^2",
        explanation: "Both parameters appear: mu in squared residuals, sigma squared in spread."
      },
      {
        title: "Estimate mu",
        math: "\\frac{\\partial\\ell}{\\partial\\mu}=\\frac{1}{\\sigma^2}\\sum(x_i-\\mu)=0\\Rightarrow\\hat\\mu=\\bar X",
        explanation: "The mean MLE is still the sample average."
      },
      {
        title: "Estimate variance",
        math: "\\frac{\\partial\\ell}{\\partial\\sigma^2}=-\\frac{n}{2\\sigma^2}+\\frac{1}{2(\\sigma^2)^2}\\sum(x_i-\\bar X)^2=0\\Rightarrow\\hat\\sigma^2=\\frac{1}{n}\\sum(x_i-\\bar X)^2",
        explanation: "The MLE divides by n, not n - 1; the unbiased sample variance is different."
      }
    ],
    result: "\\hat\\mu=\\bar X,\\quad \\hat\\sigma^2=\\frac{1}{n}\\sum(x_i-\\bar X)^2"
  }
];

export const fisherExamples: InferenceExample[] = [
  {
    id: "fisher-bernoulli",
    title: "Bernoulli(p)",
    context: "Information tells us how sharply the likelihood reacts to p.",
    steps: [
      {
        title: "Score",
        math: "U(p)=\\frac{\\partial}{\\partial p}\\log f(X;p)=\\frac{X}{p}-\\frac{1-X}{1-p}",
        explanation: "The score is the slope of the log-likelihood for one observation."
      },
      {
        title: "Information",
        math: "I(p)=\\operatorname{Var}(U(p))=\\frac{1}{p(1-p)}",
        explanation: "Information is high near the edges because outcomes are more decisive about p."
      },
      {
        title: "n observations",
        math: "I_n(p)=\\frac{n}{p(1-p)}",
        explanation: "Independent observations add information, so information grows linearly with n."
      }
    ],
    result: "I_n(p)=n/[p(1-p)]"
  },
  {
    id: "fisher-poisson",
    title: "Poisson(lambda)",
    context: "Counts reveal the rate lambda through their average.",
    steps: [
      {
        title: "Score",
        math: "U(\\lambda)=\\frac{X}{\\lambda}-1",
        explanation: "One count pushes lambda up if X exceeds lambda and down otherwise."
      },
      {
        title: "Information",
        math: "I(\\lambda)=\\operatorname{Var}\\left(\\frac{X}{\\lambda}-1\\right)=\\frac{1}{\\lambda}",
        explanation: "Because Var(X)=lambda, the score variance is 1/lambda."
      },
      {
        title: "n observations",
        math: "I_n(\\lambda)=\\frac{n}{\\lambda}",
        explanation: "More counts reduce uncertainty at the usual one-over-n rate."
      }
    ],
    result: "I_n(\\lambda)=n/\\lambda"
  },
  {
    id: "fisher-normal",
    title: "Normal(mu, known sigma^2)",
    context: "The mean is easier to estimate when sigma is small.",
    steps: [
      {
        title: "Score",
        math: "U(\\mu)=\\frac{X-\\mu}{\\sigma^2}",
        explanation: "The score is the standardized residual scaled by variance."
      },
      {
        title: "Information",
        math: "I(\\mu)=\\operatorname{Var}\\left(\\frac{X-\\mu}{\\sigma^2}\\right)=\\frac{1}{\\sigma^2}",
        explanation: "Less noise means more information about the center."
      },
      {
        title: "n observations",
        math: "I_n(\\mu)=\\frac{n}{\\sigma^2}",
        explanation: "Averaging independent measurements accumulates information."
      }
    ],
    result: "I_n(\\mu)=n/\\sigma^2"
  }
];

export const crlbExamples: InferenceExample[] = [
  {
    id: "crlb-bernoulli",
    title: "Bernoulli sample proportion",
    context: "Use the sample proportion to estimate p.",
    steps: [
      {
        title: "CRLB",
        math: "\\operatorname{Var}(T)\\ge \\frac{1}{I_n(p)}=\\frac{p(1-p)}{n}",
        explanation: "Any unbiased estimator of p cannot have variance below this bound."
      },
      {
        title: "Estimator variance",
        math: "\\operatorname{Var}(\\bar X)=\\frac{p(1-p)}{n}",
        explanation: "The sample proportion reaches the lower bound."
      },
      {
        title: "Conclusion",
        math: "\\operatorname{Var}(\\bar X)=\\operatorname{CRLB}",
        explanation: "Equality means the unbiased estimator is efficient and MVUE under regularity conditions."
      }
    ],
    result: "\\bar X is efficient for p"
  },
  {
    id: "crlb-poisson",
    title: "Poisson sample mean",
    context: "Use the sample mean to estimate lambda.",
    steps: [
      {
        title: "CRLB",
        math: "\\operatorname{Var}(T)\\ge \\frac{1}{I_n(\\lambda)}=\\frac{\\lambda}{n}",
        explanation: "The bound follows from I_n(lambda)=n/lambda."
      },
      {
        title: "Estimator variance",
        math: "\\operatorname{Var}(\\bar X)=\\frac{\\lambda}{n}",
        explanation: "Since Var(X)=lambda, averaging n counts divides variance by n."
      },
      {
        title: "Conclusion",
        math: "\\bar X\\text{ attains CRLB}",
        explanation: "The sample mean is efficient for lambda."
      }
    ],
    result: "\\bar X is efficient for \\lambda"
  }
];

export const mvueExamples: InferenceExample[] = [
  {
    id: "mvue-crlb",
    title: "CRLB method: Bernoulli p",
    context: "A fast exam route when an unbiased estimator reaches the CRLB.",
    steps: [
      {
        title: "Unbiasedness",
        math: "E(\\bar X)=p",
        explanation: "The estimator targets the parameter exactly on average."
      },
      {
        title: "Variance comparison",
        math: "\\operatorname{Var}(\\bar X)=\\frac{p(1-p)}{n}=\\frac{1}{I_n(p)}",
        explanation: "Its variance equals the Cramer-Rao lower bound."
      },
      {
        title: "Conclusion",
        math: "\\bar X\\text{ is efficient }\\Rightarrow\\bar X\\text{ is MVUE}",
        explanation: "Among unbiased estimators, none can have smaller variance."
      }
    ],
    result: "\\bar X is MVUE for p"
  },
  {
    id: "mvue-lehmann",
    title: "Lehmann-Scheffe method: Poisson lambda",
    context: "Use sufficiency and completeness when CRLB is awkward or not enough.",
    steps: [
      {
        title: "Sufficient statistic",
        math: "T=\\sum_{i=1}^n X_i\\sim\\operatorname{Poisson}(n\\lambda)",
        explanation: "The factorization theorem shows the sample sum contains all sample information about lambda."
      },
      {
        title: "Completeness",
        math: "\\{\\operatorname{Poisson}(n\\lambda):\\lambda>0\\}\\text{ is complete}",
        explanation: "Completeness means there is only one unbiased function of T for the target."
      },
      {
        title: "Unbiased estimator",
        math: "E\\left(\\frac{T}{n}\\right)=\\lambda",
        explanation: "T/n is unbiased and depends only on the complete sufficient statistic."
      },
      {
        title: "Conclusion",
        math: "\\frac{T}{n}=\\bar X\\text{ is MVUE}",
        explanation: "Lehmann-Scheffe turns unbiased plus complete sufficient into MVUE."
      }
    ],
    result: "\\bar X is MVUE for \\lambda"
  }
];

export const lrtExample: InferenceExample = {
  id: "lrt-simple",
  title: "Neyman-Pearson simple vs simple",
  context: "Compare two fully specified parameter values and reject when the data look much more likely under H1.",
  steps: [
    {
      title: "Hypotheses",
      math: "H_0:\\theta=\\theta_0\\qquad H_1:\\theta=\\theta_1",
      explanation: "Simple hypotheses specify the parameter completely."
    },
    {
      title: "Convention 1",
      math: "\\Lambda(x)=\\frac{L(\\theta_0\\mid x)}{L(\\theta_1\\mid x)}\\quad\\text{Reject }H_0\\text{ if }\\Lambda(x)<c",
      explanation: "Small Lambda means H0 is weak compared with H1."
    },
    {
      title: "Convention 2",
      math: "LR(x)=\\frac{L(\\theta_1\\mid x)}{L(\\theta_0\\mid x)}\\quad\\text{Reject }H_0\\text{ if }LR(x)>c",
      explanation: "This is the reciprocal convention; it rejects for large evidence in favor of H1."
    },
    {
      title: "Critical value",
      math: "P_{\\theta_0}(\\text{reject }H_0)=\\alpha",
      explanation: "Choose c so the Type I error probability equals the desired significance level."
    }
  ],
  result: "Reject where data are much more likely under H1 than H0"
};

export const smallLargeExamples: InferenceExample[] = [
  {
    id: "small-large",
    title: "Small sample vs large sample estimation",
    context: "Small samples need exact distributions when available; large samples often use asymptotic normality.",
    steps: [
      {
        title: "Small sample normal mean, unknown variance",
        math: "\\frac{\\bar X-\\mu}{S/\\sqrt n}\\sim t_{n-1}",
        explanation: "Use t when the population is normal and sigma is estimated from the same small sample."
      },
      {
        title: "Large sample MLE",
        math: "\\hat\\theta\\approx N\\left(\\theta,\\frac{1}{I_n(\\theta)}\\right)",
        explanation: "For regular models, the MLE becomes approximately normal as n grows."
      },
      {
        title: "Estimated standard error",
        math: "\\widehat{SE}(\\hat\\theta)=\\sqrt{\\frac{1}{I_n(\\hat\\theta)}}",
        explanation: "Plug the MLE into the information to estimate uncertainty."
      },
      {
        title: "Approximate confidence interval",
        math: "\\hat\\theta\\pm z_{\\alpha/2}\\widehat{SE}(\\hat\\theta)",
        explanation: "This is the workhorse large-sample confidence interval."
      }
    ],
    result: "Exact when possible; asymptotic when n is large"
  }
];

export const examCards: ReferenceCard[] = [
  { title: "Use Binomial", body: "Fixed number of independent trials, each success/failure, same success probability." },
  { title: "Use Poisson", body: "Counts of rare or independent events over a fixed time, area, or interval." },
  { title: "Use Exponential", body: "Waiting time until the next event in a Poisson process." },
  { title: "Use Normal approximation", body: "Binomial with large np and n(1-p), or sums/averages where CLT applies." },
  { title: "Use CLT", body: "When working with averages or sums from many independent observations with finite variance." },
  { title: "PDF vs PMF", body: "PMF gives probability at points for discrete variables. PDF gives density; probabilities are areas." },
  { title: "Bayesian vs Frequentist", body: "Bayesian updates a probability distribution for parameters. Frequentist treats parameters as fixed and studies estimator behavior." },
  { title: "MLE steps", body: "Write likelihood, take logs, differentiate, set equal to zero, solve, then check the parameter space." },
  { title: "Fisher Information steps", body: "Find score or second derivative, take variance or negative expectation, multiply by n for iid data." },
  { title: "CRLB steps", body: "Compute I_n(theta), invert it, compute estimator variance, then compare." },
  { title: "Identify MVUE", body: "Try unbiased plus CRLB equality, or use Lehmann-Scheffe with complete sufficient statistics." },
  { title: "Likelihood ratio test", body: "Compute likelihood under H0 and H1. Reject when the ratio shows data are much more likely under H1." }
];
