import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ScrollView, ListHeaderComponent} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

const HomeScreen = () => {
  let movies = [
  {
    id: '1',
    title: 'A Star is Born',
    director: 'Bradley Cooper',
    year: 2018,
  }, 
  {
    id: '2',
    title: 'Inception',
    director: 'Christopher Nolan',
    year: 2010,
  }, 
  {
    id: '3',
    title: 'Call Me by Your Name',
    director: 'Luca Guadagnino',
    year: 2017
  },
  {
    id: '4',
    title: 'Kill Bill: Volume 1',
    director: 'Quentin Tarantino',
    year: 2003,
  },
  ];

  let posts = [
  {
    id:'a',
    username: 'beccahimmel',
    program: 'A Star is Born',
    review: 'This movie was amazing! I loved the music and the acting was top-notch. Highly recommend!',
    rating: 5,
    poster: 'https://chscommunicator.com/wp-content/uploads/2018/11/a-star-is-born-movie-poster-1000x563-900x506.jpg',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'
  },

  {
    id: 'b',
    username: 'elianabrunback',
    program: 'Criminal Minds',
    review: 'I have been a fan of this show for years. The characters are well-developed and the storylines are always intriguing.',
    rating: 4,
    poster: 'https://m.media-amazon.com/images/I/71hjktnU-iL.jpg',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'

  },

  {
    id: 'c',
    username: 'valvaldez',
    program: 'Moana',
    review: 'This movie is a beautiful story about courage and self-discovery. The animation is stunning and the music is unforgettable.',
    rating: 5,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfLCbbr4jBGzf3sDmkfIicFkUqEc2FO2YMq_0i1v5TnA_1jBq4RBgcWCe&s=10',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'
  }

  ];

  const renderItem = data => {
    return (
      <TouchableOpacity 
        style={{marginRight: 10, alignItems: 'center', paddingTop: 5}}
        onPress = {() => {
          alert(`${data.item.title}\nID: ${data.item.id}\nDirected by: ${data.item.director}\nYear: ${data.item.year}`)
        }
        }>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/371159/pexels-photo-371159.jpeg?cs=tinysrgb&dpr=1&w=500' }}
          style={{ width: 110, height: 200 }}
        />
        <Text style ={styles.movieTitle}>{data.item.title}</Text>
      </TouchableOpacity>
    )
  };

  // Implement Later for posts
  // <FlatList>
  //   <ListHeaderComponent>
  //     <View style = {styles.headerContainer}>
  //       <Text style = {styles.header}>Watchd</Text>
  //     </View>
  //     <View style = {styles.searchContainer}>
  //       <TextInput
  //         style = {styles.textInput}
  //         placeholder = "Search for a movie"/>
  //     </View>
  //     <View style = {styles.forYouContainer}>
  //       <Text style = {styles.subHeader}>For You</Text>
  //       <Text style = {styles.subSubHeader}>Discover recommendations</Text>
  //       <FlatList
  //         data = {movies}
  //         horizontal = {true}
  //         showsHorizontalScrollIndicator={false}
  //         renderItem ={renderItem}
  //         keyExtractor = {item => item.id}
  //       />
  //     </View>
  //     <View style = {styles.forYouContainer}>
  //       <Text style = {styles.subHeader}>Friends' Activity</Text>
  //       <Text style = {styles.subSubHeader}>See what your friends are watching</Text>
  //     </View>
  //   </ListHeaderComponent>
  // </FlatList>

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style = {styles.headerContainer}>
        <Text style = {styles.header}>Watchd</Text>
      </View>
      <View style = {styles.searchContainer}>
        <TextInput
          style = {styles.textInput}
          placeholder = "Search for a movie"/>
      </View>
      <View style = {styles.forYouContainer}>
        <Text style = {styles.subHeader}>For You</Text>
        <Text style = {styles.subSubHeader}>Discover recommendations</Text>
        <FlatList
          data = {movies}
          horizontal = {true}
          showsHorizontalScrollIndicator={false}
          renderItem ={renderItem}
          keyExtractor = {item => item.id}
        />
      </View>
      <View style = {styles.forYouContainer}>
        <Text style = {styles.subHeader}>Friends' Activity</Text>
        <Text style = {styles.subSubHeader}>See what your friends are watching</Text>
      </View>
      {posts.map(post => (
        <View key={post.id} style={{marginTop: 20, backgroundColor: '#ffffff', borderRadius: 10, padding: 10, width: '85%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image 
              source={{ uri: post.profileImage }}
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
            />
            <Text style={{fontWeight: 'bold'}}>{post.username}</Text>
          </View>
          <Image 
              source={{ uri: post.poster }}
              style={{ width: '90%', height: 200, borderRadius: 5, marginRight: 10 , alignSelf: 'center;'}}
            />
          <Text style={{marginTop: 10}}>{post.review}</Text>
          <Text style={{marginTop: 5, fontStyle: 'italic'}}>Rating: {post.rating}/5</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
      </View>
    </View>
  );
}

const AddScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add</Text>
      </View>
    </View>
  );
}


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings-sharp' : 'settings-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6eaaff',
          tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6eaaff',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  movieTitle: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subSubHeader: {
    fontSize: 15,
    color: '#efefef',
  },
  headerContainer: {
    backgroundColor: '#6eaaff',
    alignItems: 'center',
    paddingTop: 75,
  },
  searchContainer: {
    backgroundColor: '#6eaaff',
    borderColor: '#000000',
    width: '85%',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
    padding: 10,
  },
  forYouContainer: {
    backgroundColor: '#6eaaff',
    width: '85%',
    marginTop: 30,
  },
  textInput: {
    fontSize: 18,
    padding: 2,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
});