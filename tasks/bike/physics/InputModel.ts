export default interface InputModel {
    kd: number;
    l: number;
    w: (t: number) => number;
    ni: number[];
}