import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const COLORS = {
  primary: "#94152b",
  secondary: "#f4f4f4",
  text: "#333",
  border: "#cccccc"
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "white" // Changed to white to ensure better contrast
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold"
  },
  date: {
    fontSize: 7,
    color: COLORS.text
  },
  resourceTitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold"
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "solid",
    minHeight: 20
  },
  tableHeader: {
    backgroundColor: COLORS.primary,
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
    padding: 4,
    fontSize: 7
  },
  tableCol: {
    padding: 4,
    textAlign: "left",
    fontSize: 6,
    backgroundColor: "white" // Ensure cell background is white
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5
  },
  chartImage: {
    maxWidth: "95%",
    height: 150, // Fixed height for better control
    objectFit: "contain",
    marginVertical: 10
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 6,
    textAlign: "center",
    color: COLORS.text
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 6,
    color: COLORS.text
  }
});

// Calculate dynamic column widths based on content
const calculateColumnWidths = (headers) => {
  const widths = {};
  const defaultWidth = `${100 / headers.length}%`;
  
  headers.forEach(header => {
    const headerText = header.replace(/_/g, " ").toLowerCase();
    
    // Assign custom widths based on column type
    if (headerText.includes('id')) {
      widths[header] = '10%';
    } else if (headerText.includes('sex')) {
      widths[header] = '5%';
    } else if (headerText.includes('first name') || headerText.includes('last name')) {
      widths[header] = '10%';
    } else if (headerText.includes('course')) {
      widths[header] = '15%';
    } else if (headerText.includes('email')) {
      widths[header] = '18%';
    } else if (headerText.includes('date') || headerText.includes('time')) {
      widths[header] = '8%';
    } else if (headerText.includes('mobile')) {
      widths[header] = '9%';
    } else if (headerText.includes('category')) {
      widths[header] = '7%';
    } else if (headerText.includes('college')) {
      widths[header] = '13%'; 
    } else {
      widths[header] = defaultWidth;
    }
  });
  
  return widths;
};

// Function to chunk an array into pages
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const AttendancePDF = ({ chartData = [], chartImage, chartImage2 }) => {
  const currentDate = new Date().toLocaleDateString();
  
  // Ensure chartData is not empty
  if (!chartData || chartData.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.header}>
            <Text style={styles.title}>Learning Resources Center CLA</Text>
            <Text style={styles.date}>Generated: {currentDate}</Text>
          </View>
          <Text style={styles.resourceTitle}>No data available for this report</Text>
        </Page>
      </Document>
    );
  }

  // Get headers from first data item
  const headers = Object.keys(chartData[0]);
  const columnWidths = calculateColumnWidths(headers);

  // Calculate how many rows we can show on the first page (with charts)
  const firstPageRowsLimit = 10; // Adjust as needed
  const subsequentPageRowsLimit = 20; // Adjust as needed

  // First page data (limited rows)
  const firstPageData = chartData.slice(0, firstPageRowsLimit);
  
  // Remaining data for subsequent pages
  const remainingData = chartData.slice(firstPageRowsLimit);
  const dataChunks = chunkArray(remainingData, subsequentPageRowsLimit);
  
  return (
    <Document>
      {/* First page with charts */}
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learning Resources Center CLA</Text>
          <Text style={styles.date}>Generated: {currentDate}</Text>
        </View>

        <Text style={styles.resourceTitle}>Attendance Report</Text>

        {/* Charts in a row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {chartImage && (
            <View style={[styles.chartContainer, { width: '48%' }]}>
              <Image src={chartImage} style={styles.chartImage} />
            </View>
          )}

          {chartImage2 && (
            <View style={[styles.chartContainer, { width: '48%' }]}>
              <Image src={chartImage2} style={styles.chartImage} />
            </View>
          )}
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Headers */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {headers.map((header, idx) => (
              <View 
                key={idx} 
                style={{ width: columnWidths[header] }}
              >
                <Text style={styles.tableHeaderText}>
                  {header.replace(/_/g, " ").toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows for first page */}
          {firstPageData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {headers.map((col, colIndex) => (
                <View 
                  key={colIndex} 
                  style={{ width: columnWidths[col] }}
                >
                  <Text style={styles.tableCol}>
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : ""}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Learning Resources Center - Confidential
        </Text>
        
        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${dataChunks.length + 1}`
        )} />
      </Page>

      {/* Additional pages for remaining data */}
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex + 1}`} size="A4" style={styles.page} orientation="landscape">
          {/* Simple header for continuation pages */}
          <View style={styles.header}>
            <Text style={styles.title}>Learning Resources Center CLA</Text>
            <Text style={styles.date}>Generated: {currentDate}</Text>
          </View>
          
          <Text style={styles.resourceTitle}>Attendance Report (continued)</Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Headers (repeated on each page) */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              {headers.map((header, idx) => (
                <View 
                  key={idx} 
                  style={{ width: columnWidths[header] }}
                >
                  <Text style={styles.tableHeaderText}>
                    {header.replace(/_/g, " ").toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data Rows for this page chunk */}
            {chunk.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {headers.map((col, colIndex) => (
                  <View 
                    key={colIndex} 
                    style={{ width: columnWidths[col] }}
                  >
                    <Text style={styles.tableCol}>
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © {new Date().getFullYear()} Learning Resources Center - Confidential
          </Text>
          
          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${dataChunks.length + 1}`
          )} />
        </Page>
      ))}
    </Document>
  );
};

export default AttendancePDF;