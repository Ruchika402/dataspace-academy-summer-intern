"""
EDA ANALYSIS SCRIPT - Customer Categorization Project
Author: Ruchika (Data Engineering)
Purpose: Create visualizations to understand customer data patterns
"""

# %% [markdown]
# # EDA Analysis Script
# 
# This script creates:
# 1. Age distribution histogram
# 2. Income distribution
# 3. Spending patterns by education
# 4. Correlation heatmap
# 5. Income vs Spending scatter plot
# 6. Customer segment analysis

# %%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Configuration
CLEANED_DATA_PATH = "ml/data/processed/cleaned_customer_data.csv"
OUTPUT_DIR = "ml/notebooks/eda_charts"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

# %%
print("=" * 60)
print("EDA ANALYSIS - Customer Categorization")
print("=" * 60)

# %%
# Load cleaned data
print("\n[1] Loading cleaned data...")
df = pd.read_csv(CLEANED_DATA_PATH)
print(f"✅ Loaded {df.shape[0]} rows, {df.shape[1]} columns")

# %%
# Set style for better looking charts
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# %%
# CHART 1: Age Distribution
print("\n[2] Creating Age Distribution chart...")

plt.figure(figsize=(10, 6))
plt.hist(df['Age'], bins=20, edgecolor='black', color='skyblue', alpha=0.7)
plt.title('Customer Age Distribution', fontsize=14, fontweight='bold')
plt.xlabel('Age', fontsize=12)
plt.ylabel('Number of Customers', fontsize=12)
plt.axvline(df['Age'].mean(), color='red', linestyle='dashed', linewidth=2, label=f'Mean Age: {df["Age"].mean():.1f}')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/01_age_distribution.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/01_age_distribution.png")

# %%
# CHART 2: Income Distribution
print("\n[3] Creating Income Distribution chart...")

plt.figure(figsize=(10, 6))
plt.hist(df['Income'], bins=30, edgecolor='black', color='lightgreen', alpha=0.7)
plt.title('Customer Income Distribution', fontsize=14, fontweight='bold')
plt.xlabel('Annual Income ($)', fontsize=12)
plt.ylabel('Number of Customers', fontsize=12)
plt.axvline(df['Income'].mean(), color='red', linestyle='dashed', linewidth=2, label=f'Mean Income: ${df["Income"].mean():,.0f}')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/02_income_distribution.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/02_income_distribution.png")

# %%
# CHART 3: Income vs Total Spending (Scatter Plot)
print("\n[4] Creating Income vs Spending chart...")

plt.figure(figsize=(10, 6))
scatter = plt.scatter(df['Income'], df['TotalSpending'], c=df['Age'], cmap='viridis', alpha=0.6, s=50)
plt.colorbar(scatter, label='Age')
plt.title('Income vs Total Spending (colored by Age)', fontsize=14, fontweight='bold')
plt.xlabel('Annual Income ($)', fontsize=12)
plt.ylabel('Total Spending ($)', fontsize=12)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/03_income_vs_spending.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/03_income_vs_spending.png")

# %%
# CHART 4: Spending by Education Level (Box Plot)
print("\n[5] Creating Spending by Education chart...")

plt.figure(figsize=(10, 6))
df.boxplot(column='TotalSpending', by='Education_Simplified', grid=True)
plt.title('Total Spending Distribution by Education Level', fontsize=14, fontweight='bold')
plt.suptitle('')  # Remove default title
plt.xlabel('Education Level', fontsize=12)
plt.ylabel('Total Spending ($)', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/04_spending_by_education.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/04_spending_by_education.png")

# %%
# CHART 5: Correlation Heatmap
print("\n[6] Creating Correlation Heatmap...")

# Select numeric columns for correlation
numeric_cols = ['Age', 'Income', 'TotalSpending', 'Recency', 'NumWebPurchases', 
                'NumStorePurchases', 'NumCatalogPurchases', 'NumWebVisitsMonth', 'TotalChildren']
corr_df = df[numeric_cols]

plt.figure(figsize=(10, 8))
correlation = corr_df.corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0, 
            fmt='.2f', square=True, linewidths=0.5)
plt.title('Feature Correlation Heatmap', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/05_correlation_heatmap.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/05_correlation_heatmap.png")

# %%
# CHART 6: Marital Status Distribution (Pie Chart)
print("\n[7] Creating Marital Status chart...")

marital_counts = df['Marital_Simplified'].value_counts()
plt.figure(figsize=(8, 8))
plt.pie(marital_counts.values, labels=marital_counts.index, autopct='%1.1f%%', 
        startangle=90, colors=['lightblue', 'lightcoral'])
plt.title('Customer Distribution by Marital Status', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/06_marital_status.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/06_marital_status.png")

# %%
# CHART 7: Purchase Channels (Bar Chart)
print("\n[8] Creating Purchase Channels chart...")

channels = {
    'Web': df['NumWebPurchases'].mean(),
    'Catalog': df['NumCatalogPurchases'].mean(),
    'Store': df['NumStorePurchases'].mean(),
    'Deals': df['NumDealsPurchases'].mean()
}

plt.figure(figsize=(8, 6))
plt.bar(channels.keys(), channels.values(), color=['blue', 'green', 'orange', 'red'])
plt.title('Average Purchases by Channel', fontsize=14, fontweight='bold')
plt.xlabel('Purchase Channel', fontsize=12)
plt.ylabel('Average Number of Purchases', fontsize=12)
plt.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/07_purchase_channels.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/07_purchase_channels.png")

# %%
# CHART 8: Total Children Distribution
print("\n[9] Creating Children Distribution chart...")

plt.figure(figsize=(8, 6))
df['TotalChildren'].value_counts().sort_index().plot(kind='bar', color='purple', alpha=0.7)
plt.title('Number of Children at Home', fontsize=14, fontweight='bold')
plt.xlabel('Number of Children', fontsize=12)
plt.ylabel('Number of Customers', fontsize=12)
plt.xticks(rotation=0)
plt.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/08_children_distribution.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/08_children_distribution.png")

# %%
# CHART 9: Campaign Response Rate
print("\n[10] Creating Campaign Response chart...")

campaigns = {
    'Cmp1': df['AcceptedCmp1'].sum(),
    'Cmp2': df['AcceptedCmp2'].sum(),
    'Cmp3': df['AcceptedCmp3'].sum(),
    'Cmp4': df['AcceptedCmp4'].sum(),
    'Cmp5': df['AcceptedCmp5'].sum()
}

plt.figure(figsize=(10, 6))
plt.bar(campaigns.keys(), campaigns.values(), color='teal', alpha=0.7)
plt.title('Number of Customers Who Accepted Each Campaign', fontsize=14, fontweight='bold')
plt.xlabel('Campaign', fontsize=12)
plt.ylabel('Number of Acceptances', fontsize=12)
plt.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/09_campaign_response.png', dpi=150)
plt.close()
print(f"   ✅ Saved: {OUTPUT_DIR}/09_campaign_response.png")

# %%
# SUMMARY REPORT
print("\n" + "=" * 60)
print("EDA COMPLETE - SUMMARY REPORT")
print("=" * 60)

print(f"""
✅ 9 charts created successfully!

Charts saved in: {OUTPUT_DIR}

1. age_distribution.png - Customer age spread
2. income_distribution.png - Income distribution
3. income_vs_spending.png - Relationship between income and spending
4. spending_by_education.png - Spending patterns by education level
5. correlation_heatmap.png - Feature relationships
6. marital_status.png - Customer marital status breakdown
7. purchase_channels.png - Preferred shopping channels
8. children_distribution.png - Family size distribution
9. campaign_response.png - Marketing campaign performance

📊 Key Insights to note:
- Average customer age: {df['Age'].mean():.1f} years
- Average annual income: ${df['Income'].mean():,.0f}
- Average total spending: ${df['TotalSpending'].mean():.0f}
- Most customers are: {df['Marital_Simplified'].mode()[0]}
- Most common education: {df['Education_Simplified'].mode()[0]}
""")

print("=" * 60)
print("✅ EDA COMPLETE! Ready for next steps.")
print("=" * 60)