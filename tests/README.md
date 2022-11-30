# Tests

## Automated Testing

I'm using mocha + karma + chai + headless Chrome to test the components of this library, following the setup described in [Automated testing with Headless Chrome](https://developer.chrome.com/blog/headless-karma-mocha-chai/).  Those tests are located in [tests/mocha/](https://github.com/amandaghassaei/gpu-io/blob/main/tests/mocha/).  To run the automated tests, use:

```
npm run test
```

The automated tests do not get full code coverage yet, but I'm planning to add to them when I go back to implement WebGPU features in this library.


## Browser/Device Testing

I've also included a webpage for testing various functions of this library in a browser/hardware combo of your choice.  This page is current hosted at [apps.amandaghassaei.com/gpu-io/tests/](https://apps.amandaghassaei.com/gpu-io/tests/).

Note: The detected OS and browser version may not always be 100% accurate.


## Browser Support

Here are some results I've gathered testing different combinations of hardware/browsers.  All tests are passing, but some combinations require a fragment shader polyfill (indicated by a `*`) to achieve the desired WRAP/FILTER combination, and others (indicated in yellow) fall back on internal data types that do not fully cover the range of values expected in the desired type (e.g. using FLOAT types instead of INT types, FLOAT only covers integers in the range [-16,777,216, 16,777,216.], while INT covers the range [-2,147,483,648, 2,147,483,647]).


### Mac

- macOS v11.0 + Chrome v105.0.0.0 [results](results/READWRITE_Chrome_v105.0.0.0_macOS_v11.0.png)
- macOS v10.15.7 + Firefox v104.0 [results](results/READWRITE_Firefox_v104.0_macOS_v10.15.7.png)
- macOS v10.15.7 + Safari v15.6.1 [results](results/READWRITE_Safari_v15.6.1_macOS_v10.15.7.png)
    - iMac, Macbook Pro, Macbook Air
    - (WebGL1 only) macOS v10.15.7 + Safari v14.0.3 [results](results/READWRITE_Safari_v14.0.3_macOS_v10.15.7.png)


### iOS

- iOS v15.6.1 + Safari v15.6.1 [results](results/READWRITE_Safari_v15.6.1_iOS_v15.6.1.png)
    - iPhone
    - (WebGL1 only) iOS v14.7.1 + Safari v14.1.2  [results](results/READWRITE_Safari_v14.1.2_iOS_v14.7.1.png)
- iPadOS v15.6.1 + Safari v15.6.1 [results](results/READWRITE_Safari_v15.6.1_ipadOS_v15.6.1.png)
    - iPad, iPad Air, iPad Pro, iPad Mini
    - Note: Linear filtering of FLOAT type does not seem to be natively supported on the iPad or iPad Mini, but is supported by iPad Air and iPad Pro.


### Windows

- Windows v11.0 + Edge (Chromium) v105.0.0.0 [results](results/READWRITE_Chrome_v105.0.0.0_Windows_v11.0.png)
    - Surface Laptop 4, Galaxy Book2 Pro, Galaxy Book Flex2 Alpha
    - Note: Microsoft Edge is running Chromium internally, which is why it shows up as Chrome.


### Android

- Android v12 + Chrome for Android v107.0.0.0 [results](results/READWRITE_Chrome_for_Android_v107.0.0.0_Android_v12.png)
    - Pixel 5, Motorola Edge