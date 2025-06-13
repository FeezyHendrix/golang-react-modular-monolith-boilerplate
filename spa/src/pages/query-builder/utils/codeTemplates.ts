
export const codeTemplates = {
  basicAnalysis: `import pandas as pd
import numpy as np

# Basic exploratory data analysis
print(f"Data shape: {df.shape}")
print(df.info())
print(df.describe())

# Check for missing values
print("Missing values by column:")
print(df.isnull().sum())

# Summary statistics by category
if 'category' in df.columns:
    print("Summary by category:")
    print(df.groupby('category').agg({
        df.select_dtypes(include=np.number).columns[0]: ['mean', 'min', 'max', 'count']
    }))

# Return clean dataset
return df.dropna()`,
  
  timeSeries: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA

# Ensure we have a datetime index
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    
# Resample to monthly frequency if data is granular
monthly_data = df.resample('M').sum()

# Plot the time series
plt.figure(figsize=(12, 6))
plt.plot(monthly_data)
plt.title('Time Series Data')
plt.xlabel('Date')
plt.ylabel('Value')

# Decompose the time series
if len(monthly_data) > 12:  # Need at least a year of data
    result = seasonal_decompose(monthly_data, model='multiplicative')
    
    # Plot decomposition
    fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(12, 10))
    result.observed.plot(ax=ax1)
    ax1.set_title('Observed')
    result.trend.plot(ax=ax2)
    ax2.set_title('Trend')
    result.seasonal.plot(ax=ax3)
    ax3.set_title('Seasonal')
    result.resid.plot(ax=ax4)
    ax4.set_title('Residual')
    
# Simple forecast using ARIMA
# p, d, q parameters would need to be tuned for real applications
try:
    model = ARIMA(monthly_data, order=(1, 1, 1))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=6)  # Forecast next 6 periods
    print("Forecast for next 6 periods:")
    print(forecast)
except:
    print("Could not create ARIMA model - check data format")

return monthly_data`,
  
  dataCleaning: `import pandas as pd
import numpy as np

# Make a copy of the original data
df_clean = df.copy()

# Display basic info
print(f"Original data shape: {df.shape}")
print("Missing values by column:")
print(df.isnull().sum())

# Handle missing values
# For numeric columns, fill with median
numeric_cols = df_clean.select_dtypes(include=np.number).columns
df_clean[numeric_cols] = df_clean[numeric_cols].fillna(df_clean[numeric_cols].median())

# For categorical columns, fill with mode
categorical_cols = df_clean.select_dtypes(include=['object']).columns
for col in categorical_cols:
    df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0] if not df_clean[col].mode().empty else "Unknown")

# Remove duplicates
duplicates = df_clean.duplicated().sum()
if duplicates > 0:
    print(f"Found {duplicates} duplicate rows")
    df_clean = df_clean.drop_duplicates()

# Handle outliers using IQR method for numeric columns
for col in numeric_cols:
    Q1 = df_clean[col].quantile(0.25)
    Q3 = df_clean[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = ((df_clean[col] < lower_bound) | (df_clean[col] > upper_bound)).sum()
    if outliers > 0:
        print(f"Found {outliers} outliers in {col}")
        # Cap the outliers instead of removing them
        df_clean[col] = df_clean[col].clip(lower_bound, upper_bound)

# Convert date columns to datetime if they exist
date_columns = [col for col in df_clean.columns if 'date' in col.lower() or 'time' in col.lower()]
for col in date_columns:
    try:
        df_clean[col] = pd.to_datetime(df_clean[col])
        print(f"Converted {col} to datetime")
    except:
        print(f"Could not convert {col} to datetime")

print(f"Clean data shape: {df_clean.shape}")
print("Missing values after cleaning:")
print(df_clean.isnull().sum())

return df_clean`
};

export default codeTemplates;
