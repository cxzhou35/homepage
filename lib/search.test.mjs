import assert from 'node:assert/strict'
import test from 'node:test'
import { searchSite } from './search.js'

test('searches page labels and paper metadata', () => {
  assert.equal(searchSite('teaching')[0].href, '/')
  assert.equal(
    searchSite('realme')[0].title,
    'RealMe: Immersive Volumetric Video from Minimal Captures'
  )
  assert.equal(searchSite('SIGGRAPH Asia')[0].detail, 'SIGGRAPH Asia 2026')
  assert.equal(searchSite('  ').length, 0)
  assert.equal(searchSite('no-such-result').length, 0)
})
