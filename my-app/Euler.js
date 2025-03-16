// Function representing the differential equation: dy/dx = f(x, y)
function func(x, y) {
    // Example: dy/dx = x + y
    return x + y;
}

// Euler method for solving ODE
function eulerMethod(x0, y0, h, xTarget) {
    let x = x0;
    let y = y0;

    console.log("x\t\t\t y");

    while (x <= xTarget) {
        // Calculate the next value of y using Euler method
        y = y + h * func(x, y);

        // Print the current values of x and y
        console.log(x.toFixed(2) + "\t\t " + y.toFixed(6));

        // Move to the next x value
        x = x + h;
    }
    return y;
}

// Initial values
let x0 = 0.0;
let y0 = 1.0;

// Step size
let h = 0.07;

// Target x value
let xTarget = 0.35;

// Apply Euler method and print values
let result = eulerMethod(x0, y0, h, xTarget);
console.log("The approximate value at x = " + xTarget + " is: " + result);
