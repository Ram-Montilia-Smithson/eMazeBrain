# eMazeBrain
creating APIs as a home assignment for eMazeBrain

call get request to https://emazebrain.herokuapp.com/auth to get an authentication token cookie
with which you will be able to communicate with the rest of the APIs today.

to get a new authentication token cookie after it has expired, call get request to https://emazebrain.herokuapp.com/auth?UID=${your User_id}.

call post request to https://emazebrain.herokuapp.com/tip with a json type request body containing your User_id to get one of the tips of the day with your User_id in it.
calling post request without a json type body request containing your User_id will get you the full list of tips.

call post request to https://emazebrain.herokuapp.com/add_tip with a json type request body containing the tip you want to add,
the tip must include and only tip_title, tip_body and brain_side, the response will be the tip added together with the tip_number.