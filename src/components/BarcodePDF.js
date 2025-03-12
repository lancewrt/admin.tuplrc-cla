import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Styles for the PDF
const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12 },
    title: { fontSize: 20, marginBottom: 10, textAlign: "center" },
    table: { 
        display: "table", 
        width: "100%", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "#000" 
    },
    tableRow: { 
        flexDirection: "row", 
        borderBottomWidth: 1, 
        borderColor: "#000", 
        borderStyle: "solid" 
    },
    tableColHeader: { 
        width: "50%", 
        borderWidth: 1, 
        borderStyle: "solid", 
        borderColor: "#000",
        padding: 5, 
        backgroundColor: "#94152b", 
        color: "white",
        textAlign: "center" 
    },
    tableCol: { 
        width: "50%", 
        borderWidth: 1, 
        borderStyle: "solid", 
        borderColor: "#000",
        padding: 5,
        textAlign: "center" 
    },
    image: { width: 100, height: 50, margin: "auto" }, // Define image size
});

const BarcodePDF = ({ selectedResources }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Learning Resources Center CLA - Resource Barcode</Text>
            
            {/* Table */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableColHeader}>Resource Title</Text>
                    <Text style={styles.tableColHeader}>Barcode</Text>
                </View>

                {/* Table Data */}
                {selectedResources.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCol}>{item.resource_title}</Text>
                        <View style={styles.tableCol}>
                            <Image
                                style={styles.image}
                                src={item.isbn ? `https://barcodeapi.org/api/128/${item.isbn}` : `https://barcodeapi.org/api/128/${item.resource_title}`}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default BarcodePDF;
