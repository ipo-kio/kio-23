export default function w1(t: number): number {
    return f(t+0.2) - 0.3
}

function f(t: number): number {
    return t*t + Math.sin(3*t)
}