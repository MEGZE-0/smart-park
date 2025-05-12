# Importing necessary libraries
import pandas as pd  # pandas is used for data manipulation and analysis
import numpy as np   # numpy is used for numerical operations and handling arrays
import os            # os is used for interacting with the operating system, like file path handling

# Load the dataset from a CSV file
file_path = '/content/student_habits_performance.csv'  # Path to the CSV file containing the dataset
df = pd.read_csv(file_path)  # Read the CSV file into a pandas DataFrame

# Display basic information about the dataset (like number of rows, columns, data types)
print("\nBasic Information:\n")  # Print header for basic info section
df.info()  # Display the structure of the dataset, showing column types and non-null counts

# Check for missing values in each column
print("\nMissing Values:\n")  # Print header for missing values section
print(df.isnull().sum())  # Display the total number of missing values for each column

# Drop columns that have more than 30% missing values
threshold = len(df) * 0.3  # Define a threshold where columns with more than 30% missing data will be dropped
df = df.dropna(thresh=threshold, axis=1)  # Drop columns with more than the threshold of missing values

# Fill remaining missing values with appropriate methods
for col in df.columns:  # Iterate over each column in the DataFrame
    if df[col].dtype in ['float64', 'int64']:  # Check if the column contains numerical data (integer or float)
        df[col] = df[col].fillna(df[col].median())  # Fill missing numerical values with the median of that column
    else:  # If the column contains non-numerical (categorical) data
        df[col] = df[col].fillna(df[col].mode()[0])  # Fill missing categorical values with the mode (most frequent value)

# Remove duplicate rows
df = df.drop_duplicates()  # Remove any duplicate rows from the DataFrame

# Strip leading and trailing whitespaces from string (categorical) columns
df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)  # Apply strip function to all string columns

# Convert columns to appropriate data types (attempt to convert numeric columns to proper format)
for col in df.columns:  # Iterate over all columns in the DataFrame
    try:
        df[col] = pd.to_numeric(df[col])  # Try to convert the column to numeric data type
    except ValueError:  # If it fails (because the column has non-numeric values)
        pass  # Ignore and leave the column as it is (not converted)

# Save the cleaned dataset to a new CSV file
cleaned_file_path = 'Cleaneddataset2.csv'  # Define the path for the cleaned dataset
df.to_csv(cleaned_file_path, index=False)  # Save the cleaned DataFrame to the new CSV file without row indices

# Print message indicating data cleaning completion
print("Data cleaning completed. Cleaned data saved at:", cleaned_file_path)  # Inform the user where the cleaned file is saved