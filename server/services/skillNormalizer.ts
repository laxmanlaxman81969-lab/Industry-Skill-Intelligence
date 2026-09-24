// Skill Normalization Layer
// Standardizes naming variations (e.g. 'Java 17' -> 'Java', 'SpringBoot' -> 'Spring Boot')
// Preserves original skills for faithful evidence reporting while enabling consistent taxonomy comparison

const CANONICAL_MAP: Record<string, string> = {
  'java': 'Java',
  'java 8': 'Java',
  'java 11': 'Java',
  'java 17': 'Java',
  'java 21': 'Java',
  'core java': 'Java',
  'java oop': 'Java',
  'jvm': 'Java',

  'springboot': 'Spring Boot',
  'spring boot framework': 'Spring Boot',
  'spring-boot': 'Spring Boot',
  'spring framework': 'Spring Framework',
  'spring mvc': 'Spring MVC',
  'spring security': 'Spring Security',

  'rest': 'REST API',
  'restful': 'REST API',
  'restful apis': 'REST API',
  'rest api': 'REST API',
  'rest apis': 'REST API',
  'restful web services': 'REST API',

  'sql': 'SQL',
  'structured query language': 'SQL',
  'mysql': 'MySQL',
  'my sql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'oracle sql': 'Oracle',
  'sqlite': 'SQLite',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',

  'jpa': 'JPA',
  'hibernate': 'Hibernate',
  'spring data jpa': 'JPA',
  'hibernate orm': 'Hibernate',

  'microservices': 'Microservices',
  'microservice': 'Microservices',
  'microservice architecture': 'Microservices',

  'react': 'React',
  'reactjs': 'React',
  'react js': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',

  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'es6': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',

  'html': 'HTML',
  'html5': 'HTML',
  'css': 'CSS',
  'css3': 'CSS',
  'tailwind': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',

  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'express.js': 'Express.js',

  'git': 'Git',
  'github': 'GitHub',
  'gitlab': 'GitLab',

  'junit': 'JUnit',
  'junit 5': 'JUnit',
  'mockito': 'Mockito',

  'docker': 'Docker',
  'docker container': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',

  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'jenkins': 'Jenkins',
  'github actions': 'GitHub Actions',

  'terraform': 'Terraform',
  'linux': 'Linux',
  'bash': 'Bash',

  'python': 'Python',
  'python 3': 'Python',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',

  'power bi': 'Power BI',
  'powerbi': 'Power BI',
  'tableau': 'Tableau',
  'excel': 'Excel',
  'advanced excel': 'Excel',

  'kafka': 'Kafka',
  'apache kafka': 'Kafka',

  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Azure',
  'gcp': 'GCP',
  'google cloud': 'GCP'
};

export class SkillNormalizer {
  public static normalize(skillName: string): string {
    const clean = (skillName || '').trim().toLowerCase();
    if (!clean) return '';
    if (CANONICAL_MAP[clean]) {
      return CANONICAL_MAP[clean];
    }

    // Check specific variations like 'java programming' -> 'Java'
    for (const [key, canonical] of Object.entries(CANONICAL_MAP)) {
      if (
        clean === `${key} programming` ||
        clean === `${key} development` ||
        clean === `${key} framework` ||
        clean === `${key} library` ||
        clean === `${key} database` ||
        clean === `${key} tool` ||
        clean === `core ${key}` ||
        clean === `apache ${key}`
      ) {
        return canonical;
      }
    }

    // Capitalize words if no canonical match
    return skillName
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}
