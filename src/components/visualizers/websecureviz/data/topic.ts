export const TOPIC_BASE_PATH = '/security/websecurity';
export const ENGINE_BASE_PATH = '/websecurity';

export interface TopicMeta {
  title: string;
  domain: string;
  level: string;
  duration: string;
  status: string;
  slug: string;
}

export const topicMeta: TopicMeta = {
  title: 'Web Security (XSS, CSRF, CSP, CORS)',
  domain: 'security',
  level: 'intermediate',
  duration: '50 min',
  status: 'active',
  slug: 'websecurity'
};
