import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  body: {
    padding: 16,
    minWidth: 356,
    backgroundColor: 'white',
  },

  title: {
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 20,
    marginTop: 2,
    marginBottom: 4
  },

  p: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: 8,
    marginBottom: 8
  },

  button: {
    fontSize: 14,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '700',
    color: '#2e77fc',
    marginTop: 36,
    textTransform: 'uppercase',
    border: 0,
    width: 'auto'
  },

  button2: {
    fontSize: 14,
    backgroundColor: '#2e77fc',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '400',
    color: 'white',
    marginTop: 16,
    textTransform: 'uppercase',
    border: 0,
    width: 84,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: -1 
  },

  menuClosed: {
    display: 'none',
  },

  menu: {
    width: 235,
    padding: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    position: 'absolute',
    top: 38,
    right: 16,
    zIndex: 1,
    maxHeight: 400,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    borderWidth: 1,
    marginBottom: 16
  },

  menuOption: {
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 28,
  },

  menuOptionDisabled: {
    color: 'rgba(0, 0, 0, 0.05)',
  },

  menuOptionActive: {
    color: 'rgba(0, 0, 0, 0.54)',
  },

  preview: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
    lineHeight: 16,
    marginTop: 16,
    marginBottom: 16,
  },

  trigger: {
    position: 'absolute',
    right: 0,
    top: 0,
  },

  touchable: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },

  triggerImage: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
  },

  teamAvatar: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 16
  },

  projectTitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
    height: 32,
    lineHeight: 32,
    textAlignVertical: 'center',
    position: 'absolute',
    left: 40
  },

  saving: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)'
  },

  saved: {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: 'white',
    shadowOpacity: 0
  },

  picker: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: '#333333'
  }
});
export default styles;
