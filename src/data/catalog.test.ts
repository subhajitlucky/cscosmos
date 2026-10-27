import { describe, expect, it } from 'vitest'
import { domains, domainPath } from './domains'
import { topics } from './topics'

const domainKeys = new Set(domains.map((domain) => domain.domainKey))

describe('domains', () => {
  it('has unique domain keys', () => {
    const keys = domains.map((domain) => domain.domainKey)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('has unique canonical paths', () => {
    const paths = domains.map((domain) => domainPath(domain.domainKey))
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('describes every domain', () => {
    for (const domain of domains) {
      expect(domain.name.length).toBeGreaterThan(0)
      expect(domain.description.length).toBeGreaterThan(0)
      expect(domainPath(domain.domainKey).startsWith('/')).toBe(true)
    }
  })
})

describe('topics', () => {
  it('has unique ids', () => {
    const ids = topics.map((topic) => topic.catalogId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique slugs', () => {
    const slugs = topics.map((topic) => topic.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses known domain keys', () => {
    for (const topic of topics) {
      expect(domainKeys.has(topic.domain)).toBe(true)
      for (const crossListedDomain of topic.crossListedDomains ?? []) {
        expect(domainKeys.has(crossListedDomain)).toBe(true)
      }
    }
  })

  it('gives every topic a canonical path', () => {
    for (const topic of topics) {
      expect(topic.canonicalPath).toBe(`/${topic.domain}/${topic.slug}`)
    }
  })

  it('gives every topic a name and description', () => {
    for (const topic of topics) {
      expect(topic.name.length).toBeGreaterThan(0)
      expect(topic.shortDescription.length).toBeGreaterThan(0)
    }
  })
})
