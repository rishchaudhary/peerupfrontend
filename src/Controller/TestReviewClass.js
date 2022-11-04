import {get, getDatabase, ref} from "firebase/database";
import {Review} from './Review'

export class TestReviewClass {

    constructor() {

        this.reviewID = null;
    }

    async test_create_review(rating, content, userID, tutorID) {

        this.reviewID = await Review.create_review(rating, content, userID, tutorID);
        const reviewData = Review.getReviewInformation(this.reviewID);
        const data = await reviewData.then(val => {return val;});
        console.log(data);
    }

    async test_dispute_review(comment) {


        let reviewData = Review.getReviewInformation(this.reviewID);
        let data = await reviewData.then(val => {return val;});
        let isDiputed = data.Disputed
        let comments = data.WhyDisputed;
        console.log(`Before calling dispute_review() -- Disputed: ${isDiputed} and Why review is disputed: ${comments}`);

        Review.dispute_review(this.reviewID, comment);
        reviewData = Review.getReviewInformation(this.reviewID);
        data = await reviewData.then(val => {return val;});
        isDiputed = data.Disputed
        comments = data.WhyDisputed;
        console.log(`After calling dispute_review() -- Disputed: ${isDiputed} and Why review is disputed: ${comments}`)
    }

    async test_delete_review() {

        const user1 = this.reviewID.split('/');
        console.log(user1)
        const data4 = TestReviewClass.list_of_reviews(user1[0]);
        const data3 = await data4.then(val => {
            return val;
        });
        console.log(data3)
        const data5 = Object.keys(data3);
        await Review.delete_review(this.reviewID);
        const user = this.reviewID.split('/');
        const data = TestReviewClass.list_of_reviews(user[0]);
        const data1 = await data.then(val => {return val;});
        if (data1 === null) {
            console.log(`The list of reviews before deleting -- ${data5}`)
            console.log(`The deleted reviewID is ${this.reviewID}`)
            console.log(`The list of reviews are now empty`);
            return;
        }
        const data2 = Object.keys(data1);
        console.log(`The list of reviews before deleting -- ${data5}`)
        console.log(`The deleted reviewID is ${this.reviewID}`)
        console.log(`The list of reviews are -- ${data2}`);

    }

    static async list_of_reviews(userID) {

        const db = getDatabase();
        const tutorRef = ref(db, `Reviews/${userID}`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
    }
}
