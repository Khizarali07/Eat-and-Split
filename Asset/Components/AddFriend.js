import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

// Helper function to request gallery permissions
const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      // Check for Android versions 6.0 (API 23) and above
      if (Platform.Version >= 33) {
        // Android 13+ (API 33): Use READ_MEDIA_IMAGES
        const mediaPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Media Permission',
            message:
              'This app needs access to your media files to choose photos.',
            buttonPositive: 'OK',
          },
        );
        if (mediaPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'You need to grant media permissions to use this feature.',
          );
          return false;
        }
      } else if (Platform.Version >= 23) {
        // Android 6.0 to Android 12 (API 23-32): Use READ_EXTERNAL_STORAGE
        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to choose photos.',
            buttonPositive: 'OK',
          },
        );
        if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'You need to grant storage permissions to use this feature.',
          );
          return false;
        }
      } else {
        // For Android versions below 6.0 (API < 23): No runtime permissions needed
        // Permissions are granted at install time
        console.log('No runtime permissions required for API < 23');
        return true;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS handles permissions at the system level
};

// Function to upload image to Cloudinary
const uploadToCloudinary = async fileUri => {
  const data = new FormData();
  data.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', 'reel-maker');
  data.append('cloud_name', 'df9psppug');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/df9psppug/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );
    const result = await response.json();
    if (response.ok) {
      return result.secure_url;
    } else {
      console.error('Cloudinary Upload Error:', result.error.message);
      Alert.alert('Upload Error', 'Failed to upload image to Cloudinary');
    }
  } catch (error) {
    console.error('Upload Error:', error);
    Alert.alert('Upload Error', 'An error occurred while uploading image');
  }
  return null;
};

function AddFriend({onAddFriend}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async () => {
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields!',
        position: 'Top',
      });
      return;
    }

    setLoading(true); // Start loading
    let uploadedImageUrl = null;

    if (image?.uri) {
      uploadedImageUrl = await uploadToCloudinary(image.uri);
    }

    const newFriend = {
      id: `${name}${Math.floor(Math.random() * 10000)}`,
      name,
      image:
        uploadedImageUrl ||
        'https://res.cloudinary.com/df9psppug/image/upload/v1735888752/ufxnuykteqhatjtncutv.png', // Fallback to default image
      balance: 0,
    };

    onAddFriend(newFriend);
    setLoading(false); // Stop loading
    setName('');
    setImage(null);
  };

  const handlePickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets?.[0];
        if (asset && asset.uri) {
          setImage({uri: asset.uri});
        }
      } else if (response.errorCode) {
        console.error('Gallery Error:', response.errorMessage);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Friend Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter friend's name"
      />
      <Text>Friend Image</Text>
      <View style={styles.imageView}>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          {image?.uri ? (
            <Image source={{uri: image.uri}} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>Pick an Image</Text>
          )}
        </TouchableOpacity>
      </View>
      {loading ? ( // Show loading spinner while loading
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Friend" onPress={handleSubmit} disabled={loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  imageView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePicker: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  imageText: {
    color: 'gray',
  },
  imagePreview: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
});

export default AddFriend;
