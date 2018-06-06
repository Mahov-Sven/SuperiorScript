var exports = module.exports = {};


/**
 * @deprecated
 */
class Mutex {

	constructor(allowed=1, updateFreqMilli=100){
		this.allowed = allowed;
		this.updateFreqMilli = updateFreqMilli;
	}

	async signal(){
		this.allowed++;
	}

	async _waitTime(){
		return new Promise((resolve) => {
			setTimeout(resolve, this.updateFreqMilli);
		});
	}

	async wait(){
		return new Promise((resolve) => {
			while(this.allowed <= 0)
				this._waitTime();

			this.allowed--;
			reslove();
		});
	}
}

exports.Mutex = Mutex;
