import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const CacheManager = () => {
  const [cacheFiles, setCacheFiles] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cached files from Laravel backend
  const fetchCacheFiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("cache-files", {
        params: {
          search: searchTerm,
          page: currentPage,
          perPage: perPage,
        },
      });
      console.log("API Response:", response.data); // Debugging

      // Ensure the response data is in the expected format
      if (response.data && Array.isArray(response.data.data)) {
        console.log("Cache Files:", response.data.data); // Debugging
        setCacheFiles(response.data.data);
        setTotalFiles(response.data.total || 0);
      } else {
        console.error("Invalid response format:", response.data); // Debugging
        setCacheFiles([]);
        setTotalFiles(0);
      }
    } catch (err) {
      console.error("Error fetching cache files:", err); // Debugging
      setError("Failed to fetch cache files");
      setCacheFiles([]);
      setTotalFiles(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation for a single file
  const deleteCacheFile = async (filename) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${filename}?`,
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/cache-files/${filename}`);
      // Refresh the list after deletion
      fetchCacheFiles();
    } catch (err) {
      setError("Failed to delete cache file");
    }
  };

  // Handle delete all cache files
  const deleteAllCacheFiles = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete ALL cache files?",
    );
    if (!isConfirmed) return;

    try {
      await axios.delete("http://localhost:8000/api/cache-files");
      // Refresh the list after deletion
      fetchCacheFiles();
    } catch (err) {
      setError("Failed to delete all cache files");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  // Fetch cache files on component mount or when search/page/perPage changes
  useEffect(() => {
    console.log("Fetching cache files..."); // Debugging
    fetchCacheFiles();
  }, [searchTerm, currentPage, perPage]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cache Files</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />

      {/* Items Per Page Dropdown */}
      <div style={styles.paginationControls}>
        <label>
          Items per page:
          <select
            value={perPage}
            onChange={handlePerPageChange}
            style={styles.select}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Loading State */}
      {isLoading ? (
        <p style={styles.loading}>Loading...</p>
      ) : Array.isArray(cacheFiles) && cacheFiles.length === 0 ? (
        <p style={styles.noFiles}>No cache files found.</p>
      ) : (
        <table style={{ ...styles.table, border: "1px solid red" }}>
          <thead>
            <tr>
              <th style={styles.th}>File Name</th>
              <th style={styles.th}>
                <span style={{ marginRight: "20px" }}>Actions</span>
                {cacheFiles.length > 0 && (
                  <button
                    style={styles.deleteButton}
                    onClick={deleteAllCacheFiles}
                  >
                    Delete All
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {cacheFiles.map((file, index) => (
              <tr key={index}>
                <td style={styles.td}>{file.replace(/\\/g, "/")}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteCacheFile(file)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>
          Page {currentPage} of {Math.ceil(totalFiles / perPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalFiles / perPage)}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  paginationControls: {
    marginBottom: "20px",
  },
  select: {
    marginLeft: "10px",
    padding: "5px",
    borderRadius: "5px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  noFiles: {
    textAlign: "center",
    color: "#666",
  },
  loading: {
    textAlign: "center",
    color: "#666",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  paginationButton: {
    margin: "0 10px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  pageInfo: {
    margin: "0 10px",
  },
};

export default CacheManager;
