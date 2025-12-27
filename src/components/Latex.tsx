import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, ViewStyle, View, ActivityIndicator } from 'react-native';

const MathJaxHTML = (content: string, color: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
      },
      svg: {
        fontCache: 'global'
      }
    };
  </script>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <style>
    body { 
      font-size: 18px; 
      color: ${color}; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      margin: 0;
      padding: 0;
      background-color: transparent;
      overflow: auto;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    #content {
      padding: 1px; /* Prevent margin collapse */
    }
  </style>
</head>
<body>
  <div id="content">${content}</div>
  <script>
    window.onload = function() {
      function sendHeight() {
        const height = document.getElementById('content').scrollHeight;
        window.ReactNativeWebView.postMessage(height + 20);
      }
      
      setTimeout(sendHeight, 500);
      
      const resizeObserver = new ResizeObserver(entries => {
         sendHeight();
      });
      resizeObserver.observe(document.body);
    }
  </script>
</body>
</html>
`;

interface LatexProps {
  children: string;
  style?: ViewStyle;
  textColor?: string;
  minHeight?: number;
  maxHeight?: number;
}

export const Latex = ({ children, style, textColor = '#000000', minHeight = 500, maxHeight }: LatexProps) => {
  const [height, setHeight] = useState(minHeight);

  const processedContent = children;
  const isScrollable = !!maxHeight && height > maxHeight;
  const displayHeight = isScrollable ? maxHeight : height;

  return (
    <View style={[style, { height: displayHeight, minHeight }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: MathJaxHTML(processedContent, textColor) }}
        style={{ backgroundColor: 'transparent' }}
        scrollEnabled={isScrollable}
        nestedScrollEnabled={isScrollable}
        onMessage={(event) => {
          const newHeight = Number(event.nativeEvent.data);
          if (!isNaN(newHeight) && newHeight > 0) {
            setHeight(newHeight);
          }
        }}
        showsVerticalScrollIndicator={isScrollable}
      />
    </View>
  );
};
