review questions answers

Why does a mobile application need permission before reading location?

Location is private and sensitive user data. Mobile applications must ask for permission to protect the user’s privacy and security.

What is the difference between data read from the device and data fetched from an API?

Data read from the device comes directly from the phone, such as GPS location. Data fetched from an API comes from an external server through the internet.

What are latitude and longitude used for in the API request?

Latitude and longitude identify the user’s geographic position. They are sent to APIs to get location-based data such as weather and nearby places.

Why is try/catch needed when reading location and fetching data?

try/catch is used to handle errors safely. It prevents the application from crashing if location access fails or if the network request has a problem.

Why is FlatList used for nearby Wikipedia articles but not necessarily needed for one current weather result?

FlatList is used for displaying multiple items efficiently, such as a list of nearby articles. Current weather is only one object, so FlatList is not necessary.

What does response.ok check?

response.ok checks whether the HTTP request was successful. It returns true for successful responses such as status 200.

What should happen when the user denies location permission?

The application should display a clear error message and continue running without crashing.
