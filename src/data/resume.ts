import { site } from './site';
import { portfolio } from './portfolio';

/** English source: mehmetgurcay_cv_.pdf. Dates reflect that document. */
export const resume = {
  name: site.name,
  role: 'Software & Cloud Engineer',
  summary:
    'Software and cloud engineer with over six years of experience in backend development, AWS infrastructure and real-time IoT data processing. I build event-driven pipelines, multi-account cloud environments and data platforms, with experience integrating GenAI and retrieval-augmented generation into applications.',
  location: 'Garching bei München, Germany',
  email: 'mbgurcay@gmail.com',
  github: site.github,
  experience: [
    {
      role: 'IoT Consultant',
      organization: 'Concept Reply',
      location: 'Munich',
      period: 'Nov 2024 – Present',
      highlights: [
        'Extended Tebis’s multi-account AWS architecture with Terraform and Control Tower; redesigned Route 53 DNS and VPC/Transit Gateway networking.',
        'Led requirements discussions and architecture workshops with client stakeholders.',
        'Built a Kubernetes-native security operations platform with Pixie, Tetragon and Kubescape, including Hive Sentinel telemetry processing and dynamic trace activation.',
        'Designed Danfoss’s cloud-native IoT backend with NestJS, EMQX, Kafka and MQTT, supporting telemetry from thousands of industrial devices and multi-tenant provisioning workflows.',
        'Developed GenAI support applications using AWS Bedrock, Neo4j and OpenSearch for model orchestration, retrieval and contextual reasoning.',
      ],
    },
    {
      role: 'Software Engineer',
      organization: 'Motius GmbH',
      location: 'Munich',
      period: 'May 2019 – Jul 2024',
      highlights: [
        'Delivered IoT, cloud and data projects for Siemens, BMW and Audi, from requirements through implementation and deployment.',
        'Built Siemens’s Tactix CRM knowledge graph with Neo4j, AWS Glue ETL and Lambda recommendation engines to connect siloed CRM data.',
        'Developed SmartSales analytics using Snowflake, dbt and Power BI to support next-best-action recommendations.',
        'Created a Unity3D infotainment demo using live Audi chassis telemetry and a BMW car-sharing route planner integrating traffic and vehicle availability.',
        'Maintained GitLab CI/CD and Docker deployment workflows, reviewed code and mentored junior developers.',
      ],
    },
    {
      role: 'Co-Founder',
      organization: 'Loopcake',
      location: 'İstanbul',
      period: 'Feb 2016 – Dec 2017',
      highlights: [
        'Developed a Git-integrated learning management system prototype for programming education using the MERN stack and Docker.',
        'Participated in Koç University’s KWORKS pre-acceleration program and received national entrepreneurship recognition.',
      ],
    },
  ],
  skills: [
    {
      label: 'Languages & APIs',
      skills: [
        'TypeScript',
        'Python',
        'SQL',
        'Cypher',
        'Node.js',
        'NestJS',
        'Flask',
        'GraphQL',
        'REST',
      ],
    },
    {
      label: 'Cloud & infrastructure',
      skills: [
        'AWS Glue',
        'Lambda',
        'S3',
        'VPC',
        'Transit Gateway',
        'Route 53',
        'DynamoDB',
        'SQS',
        'CloudWatch',
        'Bedrock',
        'Kafka',
      ],
    },
    {
      label: 'Data & AI',
      skills: [
        'dbt',
        'ETL pipelines',
        'LLM integration',
        'Vector databases',
        'RAG',
        'GenAI',
      ],
    },
    {
      label: 'Databases',
      skills: [
        'PostgreSQL',
        'ClickHouse',
        'Snowflake',
        'MongoDB',
        'Redis',
        'Neo4j',
      ],
    },
    {
      label: 'Delivery & teamwork',
      skills: [
        'Docker',
        'Terraform',
        'GitLab CI/CD',
        'Kubernetes',
        'Scrum',
        'Kanban',
        'Architecture reviews',
        'Mentoring',
        'Client communication',
      ],
    },
  ],
  education: [
    {
      degree: 'M.Sc. Informatics',
      institution: 'Technical University of Munich',
      period: '2021',
    },
    {
      degree: 'B.Sc. Computer Engineering',
      institution: 'Koç University, İstanbul',
      period: '2017',
    },
  ],
  languages: ['Turkish — Native', 'English — C2', 'German — B1'],
  // Professional work stays outside the printable CV.
  work: portfolio.filter((entry) =>
    [
      'aws-landing-zone',
      'sovereign-soc',
      'iot-device-management',
      'crm-knowledge-graph',
      'predictive-sales',
      'project-management',
    ].includes(entry.id),
  ),
};
