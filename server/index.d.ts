declare type User = {
  username: string;
  userId: string;
}

declare type Offer = {
  offer: RTCSessionDescription;
  fromUserId: string;
  toUserId: string;
}


type Room ={
  offererUserId: string;
  offer: RTCSessionDescription;
  offererIceCandidates: RTCIceCandidate[];
  answererUserId: string | null;
  answer: RTCSessionDescription | null;
  answererIceCandidates: RTCIceCandidate[];
}
