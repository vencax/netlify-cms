import { sanitizeIRI, sanitizeSlug } from '../urlHelper';

describe('sanitizeIRI', () => {
  // `sanitizeIRI` tests from RFC 3987
  it('should keep valid URI chars (letters digits _ - . ~)', () => {
    expect(
      sanitizeIRI("This, that-one_or.the~other 123!")
    ).toEqual('Thisthat-one_or.the~other123');
  });
  
  it('should not remove accents', () => {
    expect(
      sanitizeIRI("ěščřžý")
    ).toEqual('ěščřžý');
  });
  
  it('should keep valid non-latin chars (ucschars in RFC 3987)', () => {
    expect(
      sanitizeIRI("日本語のタイトル")
    ).toEqual('日本語のタイトル');
  });

  it('should not normalize Unicode strings', () => {
    expect(
      sanitizeIRI('\u017F\u0323\u0307')
    ).toEqual('\u017F\u0323\u0307');
    expect(
      sanitizeIRI('\u017F\u0323\u0307')
    ).not.toEqual('\u1E9B\u0323');
  });
  
  it('should allow a custom replacement character', () => {
    expect(
      sanitizeIRI("duck\\goose.elephant", { replacement: '-' })
    ).toEqual('duck-goose.elephant');
  });
  
  it('should not allow an improper replacement character', () => {
    expect(() => {
      sanitizeIRI("I! like! dollars!", { replacement: '$' });
     }).toThrow();
  });
  
  it('should not actually URI-encode the characters', () => {
    expect(
      sanitizeIRI("🎉")
    ).toEqual('🎉');
    expect(
      sanitizeIRI("🎉")
    ).not.toEqual("%F0%9F%8E%89");
  });
});


describe('sanitizeSlug', ()=> {
  
  it('throws an error for non-strings', () => {
    expect(() => sanitizeSlug({})).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug([])).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug(false)).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug(null)).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug(11234)).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug(undefined)).toThrowError("The input slug must be a string.");
    expect(() => sanitizeSlug(()=>{})).toThrowError("The input slug must be a string.");
  });

  it('throws an error for non-string replacements', () => {
    expect(() => sanitizeSlug('test', { replacement: {} })).toThrowError("`options.replacement` must be a string.");
    expect(() => sanitizeSlug('test', { replacement: [] })).toThrowError("`options.replacement` must be a string.");
    expect(() => sanitizeSlug('test', { replacement: false })).toThrowError("`options.replacement` must be a string.");
    expect(() => sanitizeSlug('test', { replacement: null } )).toThrowError("`options.replacement` must be a string.");
    expect(() => sanitizeSlug('test', { replacement: 11232 })).toThrowError("`options.replacement` must be a string.");
    // do not test undefined for this variant since a default is set in the cosntructor. 
    //expect(() => sanitizeSlug('test', { replacement: undefined })).toThrowError("`options.replacement` must be a string.");
    expect(() => sanitizeSlug('test', { replacement: ()=>{} })).toThrowError("`options.replacement` must be a string.");
  });

  it('should keep valid URI chars (letters digits _ - . ~)', () => {
    expect(
      sanitizeSlug("This, that-one_or.the~other 123!")
    ).toEqual('This-that-one_or.the~other-123');
  });

  it('removes double replacements', () => {
     expect(sanitizeSlug('test--test')).toEqual('test-test');
     expect(sanitizeSlug('test   test')).toEqual('test-test');
  });

  it('removes trailing replacemenets', () => {
    expect(sanitizeSlug('test   test   ')).toEqual('test-test');
  });

  it('uses alternate replacements', () => {
    expect(sanitizeSlug('test   test   ', { replacement: '_' })).toEqual('test_test');
  });

});