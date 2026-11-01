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

describe('fullstack curriculum split', () => {
  const fullstackTopics = topics.filter(
    (topic) =>
      topic.domain === 'fullstack' || topic.crossListedDomains?.includes('fullstack'),
  )
  const owned = fullstackTopics.filter((topic) => topic.domain === 'fullstack')
  const shared = fullstackTopics.filter((topic) => topic.domain !== 'fullstack')

  it('only cross-lists genuine shared topics into fullstack', () => {
    expect(shared.map((topic) => topic.slug).sort()).toEqual(
      ['authviz', 'dockercosmos', 'gitcosmos', 'web-encryption', 'websecurity'].sort(),
    )
  })

  it('keeps 24 core topics and 6 electives', () => {
    expect(owned.filter((topic) => topic.curriculumTags?.includes('core'))).toHaveLength(24)
    expect(owned.filter((topic) => topic.curriculumTags?.includes('elective'))).toHaveLength(6)
  })

  it('tags every owned topic as exactly one of core or elective', () => {
    for (const topic of owned) {
      const track = (topic.curriculumTags ?? []).filter(
        (tag) => tag === 'core' || tag === 'elective',
      )
      expect(track).toHaveLength(1)
    }
  })

  it('places every core topic in a core section', () => {
    const sections = ['foundations', 'frontend', 'backend', 'architecture']
    for (const topic of owned.filter((item) => item.curriculumTags?.includes('core'))) {
      expect(topic.curriculumTags?.some((tag) => sections.includes(tag))).toBe(true)
    }
  })
})
