"""
DATA CLEANING SCRIPT - Customer Categorization Project
Author: Ruchika (Data Engineering)
Purpose: Load raw customer data (tab-separated), clean it, and save to processed folder
"""

# %% [markdown]
# # Data Cleaning Script
# 
# This script will:
# 1. Load raw CSV (tab-separated) from `ml/data/raw/customer_data.csv`
# 2. Inspect the data (shape, columns, missing values, data types)
# 3. Handle missing values
# 4. Remove duplicates
# 5. Handle outliers
# 6. Fix data types
# 7. Create new features (Age, simplified categories)
# 8. Save cleaned data to `ml/data/processed/cleaned_customer_data.csv`

# %%
import pandas as pd
import numpy as np
import os

# Configuration
RAW_DATA_PATH = "ml/data/raw/customer_data.csv"
PROCESSED_DATA_PATH = "ml/data/processed/cleaned_customer_data.csv"

# Create processed folder if it doesn't exist
os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)

# %%
print("=" * 60)
print("DATA CLEANING PIPELINE - Customer Categorization")
print("=" * 60)

# %%
# ============================================
# STEP 1: Load the raw data (tab-separated)
# ============================================
print("\n[STEP 1] Loading raw data (tab-separated format)...")

try:
    # Use sep='\t' for tab-separated files
    df = pd.read_csv(RAW_DATA_PATH, sep='\t')
    print(f"✅ Successfully loaded data from: {RAW_DATA_PATH}")
    print(f"📊 Shape: {df.shape[0]} rows, {df.shape[1]} columns")
except FileNotFoundError:
    print(f"❌ ERROR: File not found at {RAW_DATA_PATH}")
    print("Please ensure the CSV file is in ml/data/raw/customer_data.csv")
    exit(1)

# %%
# ============================================
# STEP 2: Initial data inspection
# ============================================
print("\n[STEP 2] Initial data inspection...")

print("\n📋 First 5 rows:")
print(df.head())

print("\n📋 Column names:")
print(df.columns.tolist())

print("\n📋 Data types:")
print(df.dtypes)

print("\n📋 Basic statistics:")
print(df.describe())

# %%
# ============================================
# STEP 3: Check for missing values
# ============================================
print("\n[STEP 3] Checking for missing values...")

missing_counts = df.isnull().sum()
missing_percent = (missing_counts / len(df)) * 100

missing_df = pd.DataFrame({
    'Missing Count': missing_counts,
    'Missing Percent (%)': missing_percent
})
missing_df = missing_df[missing_df['Missing Count'] > 0].sort_values('Missing Percent (%)', ascending=False)

if len(missing_df) > 0:
    print(f"⚠️ Found {len(missing_df)} columns with missing values:")
    print(missing_df)
else:
    print("✅ No missing values found!")

# %%
# ============================================
# STEP 4: Handle missing values
# ============================================
print("\n[STEP 4] Handling missing values...")

# Store original shape for reporting
original_shape = df.shape

# Check for missing values in important columns
important_cols = ['Income', 'Year_Birth', 'Education', 'Marital_Status']

for col in important_cols:
    if col in df.columns and df[col].isnull().sum() > 0:
        before = df.shape[0]
        df = df.dropna(subset=[col])
        after = df.shape[0]
        print(f"   Dropped {before - after} rows with missing '{col}' values")

# Fill remaining missing values
for col in df.columns:
    if df[col].dtype in ['int64', 'float64']:
        if df[col].isnull().sum() > 0:
            median_val = df[col].median()
            df[col].fillna(median_val, inplace=True)
            print(f"   Filled missing '{col}' with median: {median_val}")
    else:
        if df[col].isnull().sum() > 0:
            mode_val = df[col].mode()[0] if len(df[col].mode()) > 0 else "Unknown"
            df[col].fillna(mode_val, inplace=True)
            print(f"   Filled missing '{col}' with mode: {mode_val}")

print(f"\n✅ Missing values handled. Shape changed from {original_shape} to {df.shape}")

# %%
# ============================================
# STEP 5: Remove duplicates
# ============================================
print("\n[STEP 5] Checking for duplicate rows...")

duplicate_count = df.duplicated().sum()
if duplicate_count > 0:
    df = df.drop_duplicates()
    print(f"✅ Removed {duplicate_count} duplicate rows")
    print(f"   New shape: {df.shape}")
else:
    print("✅ No duplicate rows found")

# %%
# ============================================
# STEP 6: Handle outliers in numeric columns
# ============================================
print("\n[STEP 6] Handling outliers...")

numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
print(f"📊 Numeric columns found: {numeric_cols}")

outliers_removed_total = 0
for col in numeric_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 3 * IQR
    upper_bound = Q3 + 3 * IQR
    outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
    if len(outliers) > 0:
        before = df.shape[0]
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
        after = df.shape[0]
        removed = before - after
        outliers_removed_total += removed
        if removed > 0:
            print(f"   Removed {removed} outliers from '{col}'")

if outliers_removed_total > 0:
    print(f"\n✅ Removed total of {outliers_removed_total} outlier rows")
else:
    print("✅ No extreme outliers found")

# %%
# ============================================
# STEP 7: Feature engineering
# ============================================
print("\n[STEP 7] Feature engineering...")

# Create Age column from Year_Birth
if 'Year_Birth' in df.columns:
    from datetime import datetime
    current_year = datetime.now().year
    df['Age'] = current_year - df['Year_Birth']
    print(f"✅ Created 'Age' column (range: {df['Age'].min()} - {df['Age'].max()})")
    
    # Remove unrealistic ages
    before = df.shape[0]
    df = df[(df['Age'] >= 18) & (df['Age'] <= 100)]
    after = df.shape[0]
    if before - after > 0:
        print(f"   Removed {before - after} rows with unrealistic ages")

# Simplify Education
if 'Education' in df.columns:
    print(f"   Original Education values: {df['Education'].unique()}")
    edu_map = {
        'Basic': 'Basic',
        '2n Cycle': 'Basic',
        'Graduation': 'Graduate',
        'Master': 'Postgraduate',
        'PhD': 'Postgraduate'
    }
    df['Education_Simplified'] = df['Education'].map(edu_map).fillna('Other')
    print(f"   Simplified Education values: {df['Education_Simplified'].unique()}")

# Simplify Marital Status
if 'Marital_Status' in df.columns:
    print(f"   Original Marital Status values: {df['Marital_Status'].unique()}")
    marital_map = {
        'Married': 'Married',
        'Together': 'Married',
        'Single': 'Single',
        'Divorced': 'Single',
        'Widow': 'Single',
        'Alone': 'Single',
        'Absurd': 'Single',
        'YOLO': 'Single'
    }
    df['Marital_Simplified'] = df['Marital_Status'].map(marital_map).fillna('Single')
    print(f"   Simplified Marital Status values: {df['Marital_Simplified'].unique()}")

# Create Total Spending column
spending_cols = ['MntWines', 'MntFruits', 'MntMeatProducts', 'MntFishProducts', 'MntSweetProducts', 'MntGoldProds']
existing_spending_cols = [col for col in spending_cols if col in df.columns]
if existing_spending_cols:
    df['TotalSpending'] = df[existing_spending_cols].sum(axis=1)
    print(f"✅ Created 'TotalSpending' column from: {existing_spending_cols}")
    print(f"   Range: ${df['TotalSpending'].min():.0f} - ${df['TotalSpending'].max():.0f}")

# Create Total Children column
if 'Kidhome' in df.columns and 'Teenhome' in df.columns:
    df['TotalChildren'] = df['Kidhome'] + df['Teenhome']
    print(f"✅ Created 'TotalChildren' column (range: {df['TotalChildren'].min()} - {df['TotalChildren'].max()})")

# %%
# ============================================
# STEP 8: Final inspection
# ============================================
print("\n[STEP 8] Final data inspection...")

print(f"\n📊 Final shape: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"\n📋 Columns ({len(df.columns)} total):")
for col in df.columns:
    print(f"   - {col} ({df[col].dtype})")

print(f"\n📊 Missing values remaining: {df.isnull().sum().sum()}")

# %%
# ============================================
# STEP 9: Save cleaned data
# ============================================
print(f"\n[STEP 9] Saving cleaned data to: {PROCESSED_DATA_PATH}")

df.to_csv(PROCESSED_DATA_PATH, index=False)
print(f"✅ Successfully saved {df.shape[0]} rows and {df.shape[1]} columns")

# %%
# ============================================
# SUMMARY REPORT
# ============================================
print("\n" + "=" * 60)
print("DATA CLEANING COMPLETE - SUMMARY REPORT")
print("=" * 60)

print(f"""
Original data shape: {original_shape}
Final data shape:   {df.shape}

Rows removed:       {original_shape[0] - df.shape[0]}
Columns added:      {df.shape[1] - original_shape[1]}

Key columns available:
- Demographic: Age, Education_Simplified, Marital_Simplified, Income
- Children: Kidhome, Teenhome, TotalChildren
- Purchase behavior: Recency, TotalSpending
- Purchase channels: NumWebPurchases, NumCatalogPurchases, NumStorePurchases
- Website activity: NumWebVisitsMonth
- Campaign responses: AcceptedCmp1-5, Response

✅ Cleaned data saved to: {PROCESSED_DATA_PATH}
""")

print("=" * 60)
print("✅ DATA CLEANING COMPLETE! Ready for EDA.")
print("=" * 60)