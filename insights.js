const bearerToken = '1691|rA7ZAQhxByMSty8TPjnwYa4UItQGhpMrzjLG1PDA52e7812f';
const userId = '1874006361043808256';
const proxyUrl = 'https://proxy.corsfix.com/?'; // Public CORS proxy (for testing only)
let dataRes;
let suffix = '';
const handle = document.getElementById("handle");
const table = document.querySelector(".following-table")
//metrics
const friendsValue = document.querySelector(".following-value");
const followersValue = document.querySelector(".followers-value");
const tweetsValue = document.querySelector(".tweets-value");
const impressionsValue = document.querySelector(".impressions-value");
let tweetsCount ;

async function fecthResults(Request) {
    try {
        let RequestStr;
        switch (Request) {
            case 1: RequestStr = 'twitter/user/' + userId; break;
            case 2: RequestStr = 'twitter/friends/list?user_id=' + userId; break;
            case 3: RequestStr = 'twitter/user/' + userId + '/tweets-and-replies'; break;
        }
        const endpoint = proxyUrl + 'https://api.socialdata.tools/' + RequestStr;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error fetching user data:", response.status, errorText);
            return;
        }

        const data = await response.json();

        if (data) {
            console.log(data);
            //REQUEST 1 : USER DATA  ( following )
            if (Request === 1) {
                handle.textContent = '@' + data.screen_name;
                followersValue.textContent = abreviate(data.followers_count);
                friendsValue.textContent = abreviate(data.friends_count);
                
            }
            //REQUEST 2 : USER's FOLLOWING
            else if (Request === 2) {

                let AbreviatedCount;
                for (let i = 0; i < 5; i++) {
                    const tr = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const tdDate = document.createElement('td');

                    AbreviatedCount = abreviate(data.users[i].followers_count);

                    tdName.innerHTML = '@' + data.users[i].screen_name;
                    tdDate.innerHTML = Math.round(AbreviatedCount * 100) / 100 + suffix;

                    table.appendChild(tr);
                    tr.appendChild(tdName);
                    tr.appendChild(tdDate);
                }
            }
            //REQUEST 3 : Tweets
            else if (Request === 3) {
                tweetsCount = data.tweets.length ;
                tweetsValue.textContent = abreviate(tweetsCount);

                for (let i = 0; i < data.tweets.length; i++) {
                    PostCard(data.tweets[i]);
                }
                displayTweetChart(data);
            }

        } else {
            console.error("not found in response:", data);

        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
}
function abreviate(value) {
    if (value > 1000) {
        suffix = 'K';
        AbreviatedCount = value / 1000;

        if (value > 1000000) {
            suffix = 'M';
            AbreviatedCount = value / 1000000;
        }
    } else {
        suffix = '';
        AbreviatedCount = value;
    }
    return AbreviatedCount;
}
function Main() {
    fecthResults(1);
    fecthResults(2);
    fecthResults(3);

}
function displayTweetChart(tweetData) {
    const ctx = document.getElementById('chartContainerPopularity').getContext('2d');
    const DATA_COUNT = 12;
    let MonthlyFavorites = [0,0,0,0,0,0,0,0,0,0,0,0]; 
    let MonthlyViews = [0,0,0,0,0,0,0,0,0,0,0,0]; 
    
    
        
        for(let j = 0 ; j < tweetData.tweets.length ; j++){
            MonthlyFavorites[tweetData.tweets[j].tweet_created_at.substring(5,7)-1] += tweetData.tweets[j].favorite_count;
            MonthlyViews[tweetData.tweets[j].tweet_created_at.substring(5,7)-1] += tweetData.tweets[j].views_count;
        }
    
    console.log(MonthlyFavorites);
    console.log(MonthlyViews);


    const labels = ['Jan','Feb','Mars','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Favorites',
                data: MonthlyFavorites,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
            {
                label: 'Views',
                data: MonthlyViews,
                borderColor: 'blue',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            }
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'VIEWS AND FAVORITES PER MONTH'
                }
            }
        },
    };
    
    new Chart(ctx , config);
}
function PostCard(tweetData) {
    const containerChart = document.querySelector(".chart-container");
    const container = document.createElement('div');
    container.classList.add('post-card');
    containerChart.appendChild(container);

    const header = document.createElement('div');
    header.classList.add('post-header');
    container.appendChild(header);

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = tweetData.user.profile_image_url_https;
    header.appendChild(profileImage);

    const postInfo = document.createElement('div');
    postInfo.classList.add('post-info');
    header.appendChild(postInfo);

    const username = document.createElement('span');
    username.classList.add('username');
    username.textContent = `@${tweetData.user.screen_name}`;
    postInfo.appendChild(username);

    const postDate = document.createElement('span');
    postDate.classList.add('post-date');
    const date = new Date(tweetData.tweet_created_at);
    postDate.textContent = date.toLocaleDateString();
    postInfo.appendChild(postDate);


    const content = document.createElement('div');
    content.classList.add('post-content');
    container.appendChild(content);

    const postText = document.createElement('p');
    postText.textContent = tweetData.full_text;
    content.appendChild(postText);

    if (tweetData.entities.media) {
        const postImage = document.createElement('img');
        postImage.classList.add('post-image');
        postImage.src = tweetData.entities.media[0].media_url_https;
        content.appendChild(postImage);
    }

    const postFooter = document.createElement('div');
    postFooter.classList.add('post-footer');
    container.appendChild(postFooter);

    const postActions = document.createElement('div');
    postActions.classList.add('post-actions');
    postFooter.appendChild(postActions);

    const comment = document.createElement('i');
    comment.classList.add("far");
    comment.classList.add("fa-comment");
    comment.textContent = tweetData.reply_count;
    postActions.appendChild(comment);

    const retweet = document.createElement('i');
    retweet.classList.add("far");
    retweet.classList.add("fa-retweet");
    retweet.textContent = tweetData.retweet_count;
    postActions.appendChild(retweet);

    const heart = document.createElement('i');
    heart.classList.add("far");
    heart.classList.add("fa-heart");
    heart.textContent = tweetData.favorite_count;
    postActions.appendChild(heart);


}

Main();
