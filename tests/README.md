# Tests

## Automated Testing

I'm using mocha + karma + chai + headless Chrome to test the components of this library, following the setup described in [Automated testing with Headless Chrome](https://developer.chrome.com/blog/headless-karma-mocha-chai/).  Those tests are located in [tests/mocha/](https://github.com/amandaghassaei/gpu-io/blob/main/tests/mocha/).  To run the automated tests, use:

```
npm run test
```

## Browser Testing

I've also included a few html pages (in the [tests/browser/](https://github.com/amandaghassaei/gpu-io/blob/main/tests/browser/) directory) for testing various functions of this library in a browser/hardware combo of your choice.  An index of these tests is current hosted at [apps.amandaghassaei.com/gpu-io/tests/](http://apps.amandaghassaei.com/gpu-io/tests/).


## Browser Support

Here are some results I've gathered testing different combinations of hardware/browsers.  All tests are passing, but some combinations require a fragment shader polyfill (indicated by a `*`) to achieve the desired WRAP/FILTER combination and others fall back on data types that do not fully cover the range of values expected in the desired type (e.g. using FLOAT types instead of INT types, FLOAT only covers integers in the range [-16,777,216, 16,777,216.], while INT covers the range [-2,147,483,648, 2,147,483,647]).


### Mac

- macOS v10.15.7 + Chrome v105.0.0.0 [readwrite](results/READWRITE_Chrome_v105.0.0.0_macOS_v10.15.7.png) / [read](results/READ_Chrome_v105.0.0.0_macOS_v10.15.7.png)
- macOS v10.15.7 + Firefox v104.0 [readwrite](results/READWRITE_Firefox_v104.0_macOS_v10.15.7.png) / [read](results/READ_Firefox_v104.0_macOS_v10.15.7.png)
- (WebGL1 only) macOS v10.15.7 + Safari v14.0.3 [readwrite](results/READWRITE_Safari_v14.0.3_macOS_v10.15.7.png) / [read](results/READ_Safari_v14.0.3_macOS_v10.15.7.png)


### Windows



### iOS

- iOS v15.5 + Safari v15.5 [readwrite](results/READWRITE_Safari_v15.5_iOS_v15.5.png) / [read](results/READ_Safari_v15.5_iOS_v15.5.png)
- (WebGL1 only) iOS v14.7.1 + Safari v14.1.2  [readwrite](results/READWRITE_Safari_v14.1.2_iOS_v14.7.1.png) / [read](results/READ_Safari_v14.1.2_iOS_v14.7.1.png)


### Android