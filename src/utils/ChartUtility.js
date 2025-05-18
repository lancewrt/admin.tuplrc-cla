// ChartUtility.js - Helper functions for chart generation and export

// Function to convert chart to base64 image manually
export const chartToBase64Image = (chartRef) => {
  try {
    if (!chartRef || !chartRef.current) {
      console.error("Chart reference is not available");
      return null;
    }

    // Get the canvas element from the chart ref
    const canvas = chartRef.current.canvas;
    
    if (!canvas) {
      console.error("Canvas element not found in chart reference");
      return null;
    }
    
    // Convert canvas to base64 image
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("Error converting chart to image:", error);
    return null;
  }
};

// Function to ensure chart is fully rendered before capturing
// captureChartAsImage.js
export const captureChartAsImage = async (chartRef) => {
    // Try both canvas and canvasEl (for Pie chart)
    const canvas = chartRef.current?.canvas || chartRef.current?.canvasEl;
    if (!canvas) {
      console.warn("Canvas not found for chart capture.");
      return null;
    }
  
    return canvas.toDataURL('image/png');
  };
  