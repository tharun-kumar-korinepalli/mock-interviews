// The seven open roles. Each role has its own interview weekend, two weeks apart
// (the weekend of 26-27 Dec is skipped for Christmas).
window.MI_JOBS = [
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    department: "Applied AI",
    location: "Nuremberg",
    workModel: "Hybrid (2 office days a week)",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2026-11-28", "2026-11-29"],
    applyBy: "2026-11-25",
    summary: "Take AI projects from first idea to a system people use every day: RAG assistants, vision models, forecasts.",
    team: [
      "Our Applied AI team has 25 engineers. We build AI features for industrial and enterprise clients: document search, visual quality checks, demand forecasts and chat assistants. Most of our clients are German Mittelstand companies, plus a few large corporates."
    ],
    role: [
      "You join a team that takes AI projects from the first idea to a system people use every day. One project may be a RAG assistant over technical manuals, the next a defect detection model for a production line. We are looking for someone with a broad base who can pick the right method for the problem and learn fast."
    ],
    tasks: [
      "Turn a customer problem into an ML task and choose the approach: classical ML, deep learning or an LLM.",
      "Build and train models in Python and PyTorch for images, text and tabular data.",
      "Build LLM applications with prompting, RAG pipelines (chunking, embeddings, vector search, reranking) and simple tool calling.",
      "Set up evaluation for every project: test sets, metrics, error analysis, and for LLM apps checks for answer quality and groundedness.",
      "Package models as APIs with FastAPI, put them in Docker and deploy them on Azure, AWS or GCP.",
      "Watch models in production and fix data drift and quality problems.",
      "Track quality, latency and cost for every LLM feature, and explain the trade-offs to the customer.",
      "Explain results to non-technical people and write clear documentation."
    ],
    requirements: [
      "Master's degree in computer science, AI, data science, mathematics, physics or a similar field.",
      "Up to 2 years of experience. Your thesis, working student jobs and serious projects count.",
      "Strong Python, Git and clean code habits, including basic testing.",
      "Solid ML basics: supervised and unsupervised learning, bias and variance, overfitting, cross validation, and metrics such as precision, recall, F1 and ROC AUC.",
      "Deep learning basics: backpropagation, CNNs, transformers and attention, and writing a training loop in PyTorch.",
      "Hands-on work in at least one of computer vision, NLP or LLM applications.",
      "You can explain how RAG works and where it fails.",
      "SQL, pandas and NumPy.",
      "Fluent English."
    ],
    nice: [
      "Docker, CI/CD and one cloud platform.",
      "Hugging Face, LangChain or LangGraph.",
      "MLflow or Weights & Biases for experiment tracking.",
      "Basic knowledge of the EU AI Act and GDPR.",
      "German at B1 level or higher.",
      "Daily use of AI coding tools such as Claude Code, Codex or GitHub Copilot, and knowing where not to trust them."
    ],
    tech: ["Python", "PyTorch", "scikit-learn", "Hugging Face", "OpenAI and Mistral APIs", "Qdrant", "pgvector", "FastAPI", "Docker", "Azure", "GitLab CI", "MLflow"],
    questions: [
      "Describe one ML or LLM project you took from idea to a working result. What was your part, and how did you measure success?",
      "A customer wants a chatbot over 5,000 PDF manuals. In a few sentences, how would you approach the first two weeks?",
      "Which area do you want to grow in first: computer vision, LLM applications or MLOps? Why?"
    ]
  },
  {
    slug: "computer-vision-engineer",
    title: "Computer Vision Engineer",
    department: "Perception",
    location: "Munich",
    workModel: "Hybrid with regular lab days",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2026-12-12", "2026-12-13"],
    applyBy: "2026-12-09",
    summary: "Build the perception that our robots and inspection cells depend on, from training to edge deployment.",
    team: [
      "Our Perception team builds the camera systems that check part quality and pick objects in factories and warehouses. Our models run on edge GPUs next to the machines, so they have to be fast and they have to work in bad lighting."
    ],
    role: [
      "You build the perception that our robots and inspection cells depend on. You train models, take them to real hardware, see where they fail, and fix them. You work with robotics, hardware and field teams."
    ],
    tasks: [
      "Train, fine-tune and evaluate models for object detection, instance and semantic segmentation, pose estimation and defect classification.",
      "Use and adapt vision foundation models such as SAM, DINOv2, CLIP and vision-language models where they save labeling work or improve results.",
      "Work in 3D with depth cameras and point clouds, including camera calibration and multi-view geometry.",
      "Combine deep learning with classical computer vision in OpenCV where that is simpler or more robust.",
      "Export and optimize models with ONNX, TensorRT and INT8 quantization, and deploy them on NVIDIA Jetson devices within a fixed latency budget.",
      "Build the data loop: collection, annotation in CVAT or Label Studio, dataset versioning, and turning field failures into new training data.",
      "Test on real machines, analyze failure cases, and make models robust to lighting changes, motion blur and new part types.",
      "Pretrain or continue pretraining backbones on our own image data with self-supervised learning, and check them with linear probing, k-NN probing and few-shot detection.",
      "Build anomaly detection for rare defects that have almost no labeled examples."
    ],
    requirements: [
      "Master's degree in computer science, electrical engineering, robotics or a similar field. A thesis or projects in computer vision count as experience.",
      "Strong Python and PyTorch. You have trained vision models end to end, from data to evaluation.",
      "Solid computer vision theory: convolution, the pinhole camera model, intrinsics and extrinsics, homography and basic epipolar geometry.",
      "You know the common architectures (ResNet, Vision Transformers, U-Net, YOLO-style and DETR-style detectors) and when to use which.",
      "You understand detection and segmentation metrics such as IoU, mAP and precision-recall curves.",
      "Practical OpenCV.",
      "Good German and English. Many industrial vision teams work in German with plant staff."
    ],
    nice: [
      "C++ for real-time pipelines.",
      "ROS 2.",
      "TensorRT, CUDA, DeepStream or GStreamer.",
      "LiDAR, sensor fusion or 3D object detection.",
      "Multi-object tracking and video models.",
      "OCR or document understanding.",
      "Robot learning or other \"physical AI\" work.",
      "Training speed-ups such as mixed precision, torch.compile and DDP or FSDP.",
      "OpenVINO for Intel hardware.",
      "Video and vision-language models for video understanding."
    ],
    tech: ["Python", "C++", "PyTorch", "OpenCV", "ONNX", "TensorRT", "CUDA", "NVIDIA Jetson Orin", "ROS 2", "CVAT", "Docker"],
    questions: [
      "Describe a computer vision model you trained. What data, architecture and metric did you use, and what was the hardest failure case?",
      "Your detector reaches good mAP on the test set but misses parts on the real line. What do you check first?",
      "How would you get a detection model to run at 30 frames per second on an edge GPU?"
    ]
  },
  {
    slug: "llm-engineer-rag",
    title: "LLM Engineer, RAG and Serving at Scale",
    department: "LLM Platform",
    location: "Berlin",
    workModel: "Hybrid",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2027-01-09", "2027-01-10"],
    applyBy: "2027-01-06",
    summary: "Keep our RAG assistant correct, fast and affordable for 200,000 daily users, with measurements behind every decision.",
    team: [
      "Our LLM Platform team runs a knowledge assistant for companies. About 400 business customers use it, and on a normal workday around 200,000 people ask it questions about their own documents. Many customers are in regulated industries, so next to API models we also host open-weight models ourselves in EU data centers."
    ],
    role: [
      "Our RAG system works. Now it has to stay correct, fast and affordable while usage keeps growing. You will own parts of the retrieval and serving stack and make decisions based on measurements, not gut feeling."
    ],
    tasks: [
      "Own the RAG pipeline end to end: document parsing, chunking, embeddings, indexing, hybrid search (BM25 plus vector), query rewriting, reranking, and grounded answers with citations.",
      "Build evaluation that runs before every release: golden datasets, retrieval metrics (recall@k, MRR, nDCG), faithfulness and answer quality checks, LLM-as-judge with human spot checks, and A/B tests.",
      "Make the system work for many users at once: per-customer data isolation and access control, caching, rate limits, queues and streaming responses.",
      "Serve open-weight models with vLLM or SGLang. Tune continuous batching, KV cache use and quantization (AWQ, GPTQ, FP8) for latency, throughput and cost per token.",
      "Work on our LLM gateway: routing between models, fallbacks, retries and cost tracking per customer.",
      "Add observability: tracing with Langfuse or OpenTelemetry, p50 and p95 latency, token cost dashboards, and on-call incident handling.",
      "Add guardrails against prompt injection and data leaks, and handle personal data in line with GDPR.",
      "Enforce document permissions inside retrieval, so each user only gets answers from documents they are allowed to see."
    ],
    requirements: [
      "Master's degree in computer science, AI or a similar field.",
      "A thesis or projects with LLMs and RAG. A system that real users touched is a big plus.",
      "Strong Python and backend skills: FastAPI, async code, REST APIs.",
      "A clear picture of how transformer inference works: tokens, context windows, prefill and decode, the KV cache, and why batching raises throughput.",
      "Hands-on RAG with a vector database such as Qdrant, Weaviate, pgvector, Elasticsearch or OpenSearch.",
      "You can design an evaluation and explain trade-offs between latency, quality and cost.",
      "Docker, Kubernetes basics and one cloud platform.",
      "Fluent English."
    ],
    nice: [
      "vLLM, SGLang, TensorRT-LLM, Ray Serve or KServe.",
      "Fine-tuning with LoRA or QLoRA, and the basics of DPO.",
      "Knowledge graphs combined with retrieval.",
      "Load testing tools.",
      "Terraform.",
      "German.",
      "Daily use of AI coding tools such as Claude Code, Codex or GitHub Copilot."
    ],
    tech: ["Python", "FastAPI", "vLLM", "Hugging Face", "Qdrant", "OpenSearch", "PostgreSQL with pgvector", "Redis", "Kubernetes", "Langfuse", "Prometheus", "Grafana", "OpenAI, Anthropic and Mistral APIs"],
    questions: [
      "Describe a RAG system you built or would build. How would you measure retrieval quality and answer quality separately?",
      "Daily users triple and p95 latency doubles. Where do you look first, and which three changes would you try?",
      "When would you host an open-weight model yourself instead of calling an API? Name the trade-offs."
    ]
  },
  {
    slug: "deep-learning-engineer",
    title: "Deep Learning Engineer, Model Training",
    department: "Applied AI Research",
    location: "Stuttgart",
    workModel: "On site 3 days a week",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2027-01-23", "2027-01-24"],
    applyBy: "2027-01-20",
    summary: "Design, train and debug neural networks on images, sensor signals and time series on our own GPU cluster.",
    team: [
      "Our Applied AI Research team trains its own neural networks on images, sensor signals and time series from industrial machines. We have an in-house GPU cluster run with Slurm, and we ship models into products, not only into papers."
    ],
    role: [
      "This role is about training models, not calling APIs. You design networks, train them from scratch or fine-tune them, find out why a run fails, and make training faster and more stable. You work closely with researchers and with the engineers who deploy your models."
    ],
    tasks: [
      "Design and implement architectures in PyTorch: CNNs, RNNs and LSTMs, transformers, autoencoders and sometimes diffusion models, including custom layers and loss functions.",
      "Run training experiments and tune optimizers (SGD, Adam, AdamW), learning-rate schedules, initialization, normalization, regularization and data augmentation.",
      "Debug training: a loss that does not go down, exploding or vanishing gradients, NaNs, overfitting and data leakage.",
      "Scale training with mixed precision (bf16, fp16), gradient accumulation, activation checkpointing, and multi-GPU training with DDP, FSDP or DeepSpeed on Slurm.",
      "Profile and speed up training with the PyTorch Profiler, and fix data loading and GPU memory bottlenecks.",
      "Keep experiments reproducible with configs, seeds and experiment tracking, and run clean ablation studies.",
      "Make models smaller for deployment through distillation, pruning and quantization.",
      "Read new papers and turn the useful ones into working code.",
      "Work on signal and sensor data as well as images: classify, detect and segment patterns in measurement data.",
      "Use domain adaptation and self-supervised representation learning when labels are scarce or data shifts between sites and machines.",
      "Spot failure modes such as feature collapse in self-supervised runs, and fix the cause instead of patching the symptom."
    ],
    requirements: [
      "Master's degree in computer science, AI, mathematics, physics or a similar field, with a thesis in a deep learning heavy setting.",
      "At least one year of hands-on deep learning training in PyTorch. Academic projects and your thesis count.",
      "Deep understanding of backpropagation, autograd and computational graphs, attention, and why normalization layers and residual connections help.",
      "The math behind it: linear algebra, calculus and probability.",
      "Comfort on Linux and the command line, with Git, Docker and a cluster job scheduler such as Slurm.",
      "Fluent English."
    ],
    nice: [
      "Distributed training frameworks such as DeepSpeed, Megatron-LM or TorchTitan.",
      "CUDA or Triton basics, and Nsight profiling.",
      "JAX.",
      "Self-supervised or contrastive learning.",
      "A paper at a workshop or conference.",
      "Generative models (diffusion or VAEs) for synthetic sensor data.",
      "Experience supervising student theses or writing technical reports."
    ],
    tech: ["Python", "PyTorch", "PyTorch Distributed", "DeepSpeed", "Slurm", "Docker", "Weights & Biases", "Hydra", "NVIDIA GPUs", "ONNX"],
    questions: [
      "Tell us about a training run that did not work. What did you see, how did you debug it, and what fixed it?",
      "Which architectures have you implemented yourself, not only imported? Pick one and explain a design choice in it.",
      "Your model needs 4x more data than fits on one GPU per step. What are your options?"
    ]
  },
  {
    slug: "machine-learning-scientist",
    title: "Machine Learning Scientist",
    department: "Applied Science",
    location: "Berlin",
    workModel: "Hybrid",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2027-02-06", "2027-02-07"],
    applyBy: "2027-02-03",
    summary: "Build forecasting, optimization and experimentation models that decide what we buy, where we store it and what we charge.",
    team: [
      "Our Applied Science team works on an online retail and logistics platform that sells several hundred thousand articles. Machine learning and mathematical optimization decide how much stock we buy, where we store it and what we charge. A one percent error in a forecast here costs real money."
    ],
    role: [
      "You build models that drive business decisions. In this team the quality of your statistics, probability and optimization matters more than the size of your model. You own problems from the first data look to a model running in production."
    ],
    tasks: [
      "Build demand forecasts at article level, from statistical baselines (ARIMA, ETS) to gradient boosting (LightGBM) and deep sequence models.",
      "Quantify uncertainty with prediction intervals, quantile losses and probabilistic forecasts, and check that they are calibrated.",
      "Turn business goals and limits into objective functions and constraints, and solve them with linear and integer programming.",
      "Design and analyze A/B tests, and measure causal effects when a clean experiment is not possible (difference in differences, propensity scores, uplift models).",
      "Validate time series models properly with backtesting and without data leakage.",
      "Write production code with tests and CI, and monitor models after release.",
      "Explain results and their limits to buyers, planners and managers.",
      "Improve product recommendations with ranking models, collaborative filtering and embeddings."
    ],
    requirements: [
      "Master's degree in a quantitative field such as statistics, mathematics, physics, computer science or operations research.",
      "Strong probability and statistics: common distributions, maximum likelihood and MAP estimation, Bayes' rule, hypothesis tests, confidence intervals and the bias-variance trade-off.",
      "Linear algebra and optimization: gradients, convexity, regularization, Lagrange multipliers and gradient descent.",
      "ML theory you can derive on a whiteboard: linear and logistic regression, decision trees and gradient boosting, SVM basics, PCA, and EM for Gaussian mixtures.",
      "Python with pandas, NumPy, scikit-learn and one gradient boosting library, plus SQL.",
      "Fluent English.",
      "A/B test design in practice: choosing success and guardrail metrics, statistical power and sample size, and reading results honestly."
    ],
    nice: [
      "Causal inference or causal ML.",
      "Bayesian modeling with PyMC or Stan.",
      "Optimization solvers such as OR-Tools, Pyomo or Gurobi.",
      "PySpark.",
      "A PhD is welcome but not required."
    ],
    tech: ["Python", "pandas", "NumPy", "scikit-learn", "LightGBM", "CatBoost", "PyTorch", "OR-Tools", "PySpark", "SQL", "Airflow", "MLflow"],
    questions: [
      "Describe a project where statistics or optimization changed a decision. What was the method and what did it change?",
      "A new recommendation widget shows +2% clicks after three days. What do you check before you call it a win?",
      "Explain in plain words why we minimize log loss for logistic regression instead of squared error."
    ]
  },
  {
    slug: "agentic-ai-engineer",
    title: "Agentic AI Engineer",
    department: "Central AI",
    location: "Munich",
    workModel: "Hybrid",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2027-02-20", "2027-02-21"],
    applyBy: "2027-02-17",
    summary: "Build AI agents that use tools safely across IT, purchasing, service and engineering, and that we can measure and roll back.",
    team: [
      "Our Central AI team builds AI agents that help colleagues in IT, purchasing, after-sales service and engineering get routine work done. Our agents read documents, call internal systems and hand results back to people for approval."
    ],
    role: [
      "You build agents that work over several steps, use tools safely and can be trusted in real processes. A good agent here is one we can measure, monitor and roll back, so evaluation and safety are part of the job from day one."
    ],
    tasks: [
      "Build agents that plan, call tools and APIs, and finish multi-step tasks, using LangGraph, PydanticAI or the model providers' SDKs.",
      "Build MCP servers that expose internal systems to agents with the right permissions, and connect agents to existing MCP tools.",
      "Design tool schemas, structured outputs, memory and the context each step needs.",
      "Set up multi-agent workflows where one agent is not enough, with human approval for risky actions.",
      "Evaluate agents: task success rate, checks on the steps they took, and cost and latency per task, with regression tests before each release.",
      "Add guardrails: narrow permission scopes, defenses against prompt injection, and audit logs.",
      "Deploy agents to production with monitoring and step-by-step rollouts.",
      "Write the model harness, prompt strategy and context management for each agent, and switch models through a gateway such as LiteLLM.",
      "Watch for hallucinations and unsafe behavior in production, and add counter-measures."
    ],
    requirements: [
      "Master's degree in computer science, AI or a similar field.",
      "Good Python and software engineering, including REST APIs and async code.",
      "Hands-on work with LLM APIs, function or tool calling, and RAG.",
      "A clear view of LLM limits: hallucination, context limits and non-deterministic output, and how to design around them.",
      "Experience with at least one agent framework.",
      "Fluent English.",
      "Basic knowledge of privacy, safety and responsible AI checks for generative systems."
    ],
    nice: [
      "MCP servers or clients you have built.",
      "Azure OpenAI, Databricks or Vertex AI.",
      "TypeScript.",
      "A workflow engine such as Temporal.",
      "German at B2 level, since many of our internal users work in German.",
      "Daily use of AI coding tools such as Claude Code, Codex or GitHub Copilot."
    ],
    tech: ["Python", "LangGraph", "PydanticAI", "MCP", "FastAPI", "Azure OpenAI", "PostgreSQL", "Kubernetes", "Langfuse", "GitLab CI"],
    questions: [
      "Describe an agent or tool-calling system you built. How did you stop it from doing the wrong thing?",
      "An agent can create purchase orders. Which guardrails and approval steps would you add before it goes live?",
      "How would you measure whether a new agent version is better than the old one?"
    ]
  },
  {
    slug: "mlops-engineer",
    title: "MLOps / ML Platform Engineer",
    department: "ML Platform",
    location: "Hamburg",
    workModel: "Hybrid",
    type: "Full time, permanent",
    level: "Junior to mid level",
    interviewDays: ["2027-03-06", "2027-03-07"],
    applyBy: "2027-03-03",
    summary: "Build the shared paths that take a model from a notebook to a monitored service, for 15 ML and LLM teams.",
    team: [
      "Our ML Platform team serves 15 product teams that build ML and LLM features. We give all of them shared tools to train, deploy and monitor models, so no team has to build its own setup from scratch."
    ],
    role: [
      "You build and run the paths that take a model from a notebook to a monitored service. Your users are other engineers, and your success is how fast and safely they can ship."
    ],
    tasks: [
      "Build and run training and deployment pipelines (CI/CD for ML), a model registry and shared feature pipelines.",
      "Run model services on Kubernetes with GPU scheduling and autoscaling.",
      "Operate serving infrastructure such as Triton Inference Server, KServe or Ray Serve, and vLLM for LLMs.",
      "Monitor data drift, model quality, latency and errors with Prometheus and Grafana, and set alerts that matter.",
      "Keep experiments reproducible with MLflow and data versioning.",
      "Manage infrastructure as code with Terraform and Helm.",
      "Track and cut GPU costs.",
      "Write docs and templates so teams can serve themselves.",
      "Build observability and evaluation for LLM apps with OpenTelemetry, Langfuse or Arize Phoenix: test sets, automated quality checks, latency and cost.",
      "Add health checks, retries and provider failover, so an outage at one LLM provider does not take the product down.",
      "Run batch inference jobs and recurring data pipelines."
    ],
    requirements: [
      "Master's degree in computer science or a similar field.",
      "Python and good software engineering habits, and comfort on Linux.",
      "Docker, Kubernetes basics and one cloud platform.",
      "CI/CD with GitLab CI or GitHub Actions.",
      "You understand the ML lifecycle: train, validate, deploy, monitor and retrain, and what goes wrong at each step.",
      "Fluent English.",
      "At least one practical project that uses an LLM API or LLM framework."
    ],
    nice: [
      "Terraform, Helm or ArgoCD.",
      "Slurm or other GPU cluster schedulers.",
      "LLMOps: tracing, evaluation pipelines and prompt versioning.",
      "Spark or Databricks.",
      "German.",
      "GitOps with ArgoCD and Kustomize.",
      "FastAPI and Pydantic."
    ],
    tech: ["Python", "Docker", "Kubernetes", "Terraform", "Helm", "ArgoCD", "MLflow", "Triton Inference Server", "KServe", "vLLM", "Prometheus", "Grafana", "AWS"],
    questions: [
      "Describe how you deployed a model or service. How did you know it was healthy after release?",
      "A model's accuracy drops slowly over two months but nothing crashes. How would your platform catch this?",
      "What belongs in a good CI/CD pipeline for an ML model, step by step?"
    ]
  }
];
