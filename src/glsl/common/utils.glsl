/**
 * Returns accurate MOD when arguments are approximate integers.
 */
float modI(float a, float b) {
    float m = a - floor((a + 0.5) / b) * b;
    return floor(m + 0.5);
}