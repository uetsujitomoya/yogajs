let Hatsugen = () => {
    this.orijin="";

    this.task="";
    this.changeTask=(task)=>{
        if(task=="C"){
            task="T";
        }else if(task=="T"){
            task="C";
        }
    };

    this.talker="";
    this.changeTalker=changeTalker(this.talker);

    this.sentences=()=>{
        this.orijin="";

        this.task="";
        this.talker="";
        this.changeTalker=changeTalker(this.talker);

        this.words=()=>{
            this.orijin="";
            this.task="";

            this.talker="";
            this.changeTalker=changeTalker(this.talker);
        }
    };
};

let changeTalker=(talker)=>{
    if(talker=="C"){
        talker="T";
    }else if(talker=="T"){
        talker="C";
    }
};

let changeTask=(task)=>{
};