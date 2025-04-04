## Crime Data Detection

This dataset reflects incidents of crime in the City of Los Angeles dating back to 2020.

## Current Progress

**Crime data is being successfully ingested into MongoDB**, with unnecessary fields removed and location data formatted correctly.  
**Google Street View images are being fetched and stored**, associating them with crime records using GridFS.  
**An API endpoint is available to fetch crime scene images**, reducing redundant API calls.  
**Further improvements may be needed** for handling errors, optimizing batch processing, and refining image retrieval logic.

## Basic Overview

### 1. Crime Data Ingestion (`mongotest_data_dump.js`)

- Connects to a MongoDB database (`ProjectTest`).
- Reads a CSV file containing crime data.
- Cleans and processes the data, removing unnecessary fields.
- Converts latitude/longitude into **geospatial coordinates**.
- Inserts the cleaned data into the `CrimeRate` collection in MongoDB.

### 2. Crime Image Retrieval (`mongotest_images_dump.js`)

- Uses **MongoDB GridFS** to store images.
- Fetches crime locations from the database.
- Uses the **Google Street View API** to retrieve images for crime locations.
- Stores the images in GridFS, linking them to relevant crime records.
- Provides an API endpoint (`/fetch-image`) to check if an image exists or fetch a new one.

## Glossary for the dataset

This section provides definitions for key terms and variables used in the dataset.

| Column Name        | Description                                                                                                                                                       | API Field Name | Data Type          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| **DR_NO**          | Division of Records Number: Official file number made up of a 2-digit year, area ID, and 5 digits                                                                 | dr_no          | Text               |
| **Date Rptd**      | MM/DD/YYYY                                                                                                                                                        | date_rptd      | Floating Timestamp |
| **DATE OCC**       | MM/DD/YYYY                                                                                                                                                        | date_occ       | Floating Timestamp |
| **TIME OCC**       | In 24-hour military time                                                                                                                                          | time_occ       | Text               |
| **AREA NAME**      | The 21 Geographic Areas or Patrol Divisions are also given a name designation that references a landmark or the surrounding community that it is responsible for. | area_name      | Text               |
| **Crm Cd**         | Indicates the crime committed. (Same as Crime Code 1)                                                                                                             | crm_cd         | Text               |
| **Crm Cd Desc**    | Defines the Crime Code provided.                                                                                                                                  | crm_cd_desc    | Text               |
| **Vict Age**       | Two-character numeric representation of victim's age.                                                                                                             | vict_age       | Text               |
| **Vict Sex**       | F - Female, M - Male, X - Unknown                                                                                                                                 | vict_sex       | Text               |
| **Vict Descent**   | Descent Code: Various ethnic/racial classifications.                                                                                                              | vict_descent   | Text               |
| **Premis Cd**      | The type of structure, vehicle, or location where the crime took place.                                                                                           | premis_cd      | Number             |
| **Premis Desc**    | Defines the Premise Code provided.                                                                                                                                | premis_desc    | Text               |
| **Weapon Used Cd** | The type of weapon used in the crime.                                                                                                                             | weapon_used_cd | Text               |
| **Weapon Desc**    | Defines the Weapon Used Code provided.                                                                                                                            | weapon_desc    | Text               |
| **Status Desc**    | Defines the Status Code provided.                                                                                                                                 | status_desc    | Text               |
| **Crm Cd 2**       | Additional crime code, less serious than Crime Code 1.                                                                                                            | crm_cd_2       | Text               |
| **LOCATION**       | Street address of crime incident rounded to the nearest hundred block.                                                                                            | location       | Text               |
| **Cross Street**   | Cross street of rounded address.                                                                                                                                  | cross_street   | Text               |
| **LAT**            | Latitude                                                                                                                                                          | lat            | Number             |
| **LON**            | Longitude                                                                                                                                                         | lon            | Number             |
