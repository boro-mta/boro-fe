import { IUserDetails } from "../types";
import { IMG_4, IMG_5, IMG_6 } from "./images";

export const allUserDetails: IUserDetails[] = [
    {
        userId: '1',
        profileImage: IMG_4,
        firstName: 'Mor',
        lastName: 'panckakesplease',
        about: 'My view on borrowing things is that it can be a useful way to save money and resources, as well as build relationships with others in the community. I understand that borrowing comes with the responsibility of taking care of the borrowed item and returning it in a timely manner. However, I also recognize that there can be challenges in borrowing, such as miscommunications or misunderstandings around expectations. Overall, I believe that borrowing can be a beneficial practice when approached with respect and clear communication.',
        dateJoined: '2025',

    },
    {
        userId: '2',
        profileImage: IMG_5,
        firstName: 'Rita',
        lastName: 'bepita',
        about: 'I have a confession to make: I absolutely love taking things without paying... but only when it\'s through borrowing! There\'s something so thrilling about being able to borrow a tool or item from a stranger and return it with gratitude and a smile. It\'s like a mini adventure each time, and I love being able to help out fellow community members by lending out my own items too. So, if you\'re in need of something, just give me a shout and let\'s make it happen',
        dateJoined: '1945',

    },
    {
        userId: '3',
        profileImage: IMG_6,
        firstName: 'Alon',
        lastName: 'deloco',
        about: 'I\'ll admit, I was a bit skeptical when I first signed up. I mean, who really lends out their stuff to complete strangers? But now that I\'ve been using this app for a while, I\'ve come to realize that there are a lot of generous people out there who genuinely want to help others. And as a result, I\'ve been able to borrow all sorts of things that I never would have been able to afford on my own.',
        dateJoined: '252 BC',

    },
    {
        userId: '0',
        profileImage: IMG_6,
        firstName: 'user that is not in the server',
        lastName: '...',
        about: '',
        dateJoined: '0',

    }

];