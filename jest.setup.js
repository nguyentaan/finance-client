import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};

// Mock canvas methods
window.HTMLCanvasElement.prototype.getContext = () => {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (x, y, w, h) => {
            return {
                data: new Array(w * h * 4),
            };
        },
        putImageData: () => {},
        createImageData: () => {
            return [];
        },
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => {
            return { width: 0 };
        },
        transform: () => {},
        rect: () => {},
        clip: () => {},
    };
};

// Mock ResizeObserver
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Mock other methods if needed
