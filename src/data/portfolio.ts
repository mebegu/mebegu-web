/**
 * English outlines condensed from the supplied CVs.
 * Current projects: mehmetgurcay_cv_.pdf.
 * Older details: mehmetgurcaycv (14).pdf, pp. 3–6.
 * No invented metrics, project dates, screenshots or public links.
 */
export interface PortfolioEntry {
  id: string;
  kind: 'games' | 'software';
  visual: 'world' | 'gameplay' | 'app' | 'tool' | 'shader';
  title: string;
  context: string;
  contribution: string;
  outcome: string;
  technologies: string[];
  organization: string;
  period?: string;
}

export const portfolio: PortfolioEntry[] = [
  {
    id: 'car-chassis-telemetry',
    kind: 'games',
    visual: 'gameplay',
    title: 'Real-Time Car Chassis Telemetry',
    organization: 'Motius · Audi',
    period: '6 months',
    context:
      'An in-car infotainment demo that made live chassis telemetry interactive through gamification.',
    contribution:
      'Developed Unity3D/C# screens, four standalone games and an independent menu hub in a three-person Scrum team.',
    outcome:
      'A working demo installed in the vehicle, connecting the interactive experience to real-time chassis data.',
    technologies: ['Unity3D', 'C#', 'Real-time telemetry'],
  },
  {
    id: 'aws-landing-zone',
    kind: 'software',
    visual: 'world',
    title: 'AWS Landing Zone & Governance',
    organization: 'Concept Reply · Tebis',
    context:
      'A multi-account AWS environment with governance and secure inter-account networking.',
    contribution:
      'Extended the architecture with Terraform and Control Tower, redesigned Route 53 DNS and VPC/Transit Gateway topology, and led requirements and architecture workshops.',
    outcome:
      'Infrastructure and networking changes supporting the client’s multi-account cloud environment.',
    technologies: [
      'AWS Control Tower',
      'Terraform',
      'Route 53',
      'VPC',
      'Transit Gateway',
    ],
  },
  {
    id: 'sovereign-soc',
    kind: 'software',
    visual: 'tool',
    title: 'Adaptive Kubernetes Sovereign SOC',
    organization: 'Concept Reply · Open-source project',
    context:
      'A Kubernetes-native security operations platform for anomaly detection and forensic automation.',
    contribution:
      'Built with Pixie, Tetragon and Kubescape, and developed Hive Sentinel: a telemetry API with dynamic trace activation and ETL for HTTP, DNS and syscall logs.',
    outcome:
      'A telemetry-processing and investigation workflow built around CNCF tools.',
    technologies: ['Kubernetes', 'Pixie', 'Tetragon', 'Kubescape', 'ETL'],
  },
  {
    id: 'iot-device-management',
    kind: 'software',
    visual: 'app',
    title: 'IoT Device Management & Data Router',
    organization: 'Concept Reply · Danfoss',
    context:
      'A cloud-native backend for industrial device communication and real-time telemetry.',
    contribution:
      'Designed the backend architecture and led development of a multi-tenant device platform covering provisioning, onboarding and automated configuration.',
    outcome:
      'Device management and telemetry ingestion supporting thousands of industrial devices.',
    technologies: ['NestJS', 'EMQX', 'Kafka', 'MQTT'],
  },
  {
    id: 'genai-support',
    kind: 'software',
    visual: 'shader',
    title: 'GenAI Customer Support Agent',
    organization: 'Concept Reply · Internal innovation',
    context:
      'AI-assisted customer support combining language models with cloud services and knowledge retrieval.',
    contribution:
      'Built model orchestration and prompt workflows with AWS Bedrock; applied RAG with Neo4j and OpenSearch and integrated language models into application pipelines.',
    outcome:
      'End-to-end support workflows using retrieval, contextual reasoning and model integration.',
    technologies: ['AWS Bedrock', 'Neo4j', 'OpenSearch', 'RAG', 'LLMs'],
  },
  {
    id: 'crm-knowledge-graph',
    kind: 'software',
    visual: 'world',
    title: 'CRM Knowledge Graph',
    organization: 'Motius · Siemens',
    period: '3+ years',
    context:
      'Connecting siloed CRM data to support sales insights and relationship mapping.',
    contribution:
      'Built graph models, Python ETL, GraphQL APIs and recommendation engines; integrated data across systems, added RAG/vector search and maintained automated quality checks.',
    outcome:
      'A CRM knowledge graph and sales-analysis engines developed in an eight-person Scrum team with cross-company data integration.',
    technologies: [
      'Neo4j',
      'Python',
      'GraphQL',
      'AWS Glue',
      'Lambda',
      'DynamoDB',
      'SQS',
      'Jest',
    ],
  },
  {
    id: 'predictive-sales',
    kind: 'software',
    visual: 'app',
    title: 'Predictive Sales Analytics',
    organization: 'Motius · Siemens',
    period: '1 year',
    context:
      'Turning sales data into next-best-action recommendations and management insights.',
    contribution:
      'Created SQL transformation pipelines with dbt on Snowflake and Power BI dashboards; investigated user behaviour, recommendation lifecycles and historical sales.',
    outcome:
      'Data models and dashboards for exploring products, potential customers and sales opportunities.',
    technologies: ['Snowflake', 'dbt', 'SQL', 'Power BI'],
  },
  {
    id: 'project-management',
    kind: 'software',
    visual: 'tool',
    title: 'Project Management & Communication',
    organization: 'Client project',
    period: '18 months',
    context:
      'A collaboration application for a government office, covering projects, tasks and reporting.',
    contribution:
      'Developed the application in a six-person Scrum team, with automated PDF reports, third-party notifications, calendars and attendee tracking.',
    outcome: 'Task, project, event and reporting workflows in one application.',
    technologies: [
      'PostgreSQL',
      'Express',
      'React',
      'Node.js',
      'TypeScript',
      'TypeORM',
      'Docker',
      'GitLab CI/CD',
    ],
  },
  {
    id: 'customer-feedback',
    kind: 'software',
    visual: 'app',
    title: 'Customer Feedback Service',
    organization: 'Client project',
    period: '8 months',
    context:
      'A service for storing feedback and stories so representatives could review customer history.',
    contribution:
      'Transformed tabular data into a Neo4j graph with Python ETL, built TypeScript GraphQL APIs and used AWS Lambda with Docker/GitLab delivery workflows.',
    outcome:
      'A graph-based feedback and story service developed with a six-person Scrum team.',
    technologies: [
      'Neo4j',
      'TypeScript',
      'GraphQL',
      'Python',
      'AWS Lambda',
      'DynamoDB',
      'Docker',
    ],
  },
  {
    id: 'iot-route-planner',
    kind: 'software',
    visual: 'world',
    title: 'IoT Route Planner',
    organization: 'Motius · BMW',
    period: '6 months',
    context:
      'Departure-time planning for a car-sharing journey, using vehicle availability and live route information.',
    contribution:
      'Built car tracking and route planning with Node.js/Express, TypeScript and MongoDB, integrating company APIs and Google Maps with traffic, walking and queue-time factors.',
    outcome:
      'A route-planning workflow combining the different stages of a journey to help users choose a departure time.',
    technologies: [
      'Node.js',
      'Express',
      'TypeScript',
      'MongoDB',
      'Google Maps API',
    ],
  },
  {
    id: 'loopcake',
    kind: 'software',
    visual: 'tool',
    title: 'Loopcake',
    organization: 'Co-founded startup',
    period: '2016–2017',
    context:
      'A Git-integrated learning management system for programming courses.',
    contribution:
      'Co-founded the startup and worked across business development and R&D, building the prototype with the MERN stack, TypeScript and Docker.',
    outcome:
      'A working LMS prototype, participation in KWORKS and Koç University’s Best Design Project award in 2017.',
    technologies: [
      'MongoDB',
      'Express',
      'React',
      'Node.js',
      'TypeScript',
      'Docker',
      'Git',
    ],
  },
];
