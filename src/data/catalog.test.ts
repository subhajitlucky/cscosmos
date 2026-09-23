import { describe, expect, it } from 'vitest'
import { domains } from './domains'
import { topics } from './topics'

const domainKeys = new Set(domains.map((d) => d.domainKey))

describe('domains', () => {
  it('has unique domain keys', () => {
    const keys = domains.map((d) => d.domainKey)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('has unique paths', () => {
    const paths = domains.map((d) => d.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('describes every domain', () => {
    for (const domain of domains) {
      expect(domain.name.length).toBeGreaterThan(0)
      expect(domain.description.length).toBeGreaterThan(0)
      expect(domain.path.startsWith('/')).toBe(true)
    }
  })
})

describe('topics', () => {
  it('has unique ids', () => {
    const ids = topics.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique slugs', () => {
    const slugs = topics.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses known domain keys', () => {
    for (const topic of topics) {
      expect(domainKeys.has(topic.domain)).toBe(true)
      for (const alias of topic.aliases ?? []) {
        expect(domainKeys.has(alias)).toBe(true)
      }
    }
  })

  it('gives every active topic a url', () => {
    for (const topic of topics) {
      if (topic.status === 'active') {
        expect(topic.url).toBeTruthy()
      }
    }
  })

  it('gives every topic a name and description', () => {
    for (const topic of topics) {
      expect(topic.name.length).toBeGreaterThan(0)
      expect(topic.shortDescription.length).toBeGreaterThan(0)
    }
  })
})
