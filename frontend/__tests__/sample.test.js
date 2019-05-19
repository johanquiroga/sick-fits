describe('sample test 101', () => {
  it('should work as expected', () => {
    expect(1).toEqual(1);
  });

  it('should handle ranges fine', () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });

  it('should make a list of dog names', () => {
    const dogs = ['snickers', 'hugo'];
    expect(dogs).toEqual(dogs);
    expect(dogs).toContain('snickers');
  });
});
