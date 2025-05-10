/**
 *Submitted for verification at basescan.org on 2025-04-07
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(msg.sender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

    /**
     * Random number generation smart contract by pepper.meme to generate unpredictable number using seed and block hash that is unknown on generation moment.
     * To use it first generateSeed and store it in your contract, then on next request use generateNumberFromSeed that will give you desired random outcome.
     * If it's used for lotery or other activity that involves payments, payment should be deducted in first transaction where seed is generated.
     * Second transaction is used for execution when result outcome needs to be executed
     * If contract doesn't require high level of security generateNumber could be used to get instant result.
     */

contract Random is Ownable {

    event TrustedPartyAdded(address indexed trustedParty);
    event TrustedPartyRemoved(address indexed trustedParty);

    uint256 private count;
    mapping(uint256 => uint256) private seeds;
    mapping(uint256 => bytes32) public blocks;
    mapping(address => bool) public trustedParties;
    uint256 public lastBlock;
    uint256[] public oldBlocks;

    function addTrustedParty(address __trustedParty) external onlyOwner {
        trustedParties[__trustedParty] = true;
        emit TrustedPartyAdded(__trustedParty);
    }

    function removeTrustedParty(address __trustedParty) external onlyOwner {
        trustedParties[__trustedParty] = false;
        emit TrustedPartyRemoved(__trustedParty);
    }

    modifier onlyTrustedParty() {
        require(trustedParties[msg.sender], "Caller is not trusted party");
        _;
    }

    function setBlockHash(uint256 __blockNumber, bytes32 __blockHash) external onlyTrustedParty {
        require(blocks[__blockNumber] == 0, "Block hash already set");
        for (uint256 __i = 0; __i < oldBlocks.length; __i++) {
            //we can only set blockHash if it's missing
            if (oldBlocks[__i] == __blockNumber) {
                blocks[__blockNumber] = __blockHash;
                if (oldBlocks.length - __i > 1) {
                    oldBlocks[__i] = oldBlocks[oldBlocks.length - 1];
                }
                oldBlocks.pop();
                break;
            }
        }
    }

    function getOldBlockCount() public view returns (uint256) {
        return oldBlocks.length;
    }

    function getLastBlockAge() public view returns (uint256) {
        if (lastBlock > 0) {
            return (block.number - lastBlock);
        }
        return (0);
    }

    function checkLastBlock() public {
        if (lastBlock > 0 && lastBlock != block.number) {
            if (lastBlock + 250 > block.number && uint256(blockhash(lastBlock)) > 0) {
                blocks[lastBlock] = blockhash(lastBlock);
            } else {
                oldBlocks.push(lastBlock);
            }
            lastBlock = 0;
        }
    }

    function _generateSeed() internal returns (uint256 seed) {
        checkLastBlock();
        seed = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, count, gasleft(), msg.sender)));
        //in case seed is 0 future checks would fail for it so we set it to 1
        if (seed == 0) {
            seed = 1;
        }
        count = uint256(keccak256(abi.encodePacked(block.timestamp, seed, gasleft())));
        return (seed);
    }

    function generateSeed() public returns (uint256 seed) {
        (seed) = _generateSeed();
        require(seeds[seed] == 0, "Seed already exists");
        lastBlock = block.number;
        seeds[seed] = block.number;
        return (seed);
    }

    function generateNumberFromSeed(uint256 __seed, uint256 __max) external returns (uint256 number) {
        checkLastBlock();
        require(seeds[__seed] > 0, "There is no such seed");
        require(blocks[seeds[__seed]] > 0, "Block hash is missing");
        number = uint256(keccak256(abi.encodePacked(seeds[__seed], blocks[seeds[__seed]]))) % __max + 1;
        return (number);
    }

    function generateNumber(uint256 __max) external returns (uint256 number) {
        (uint256 _seed) = _generateSeed();
        number = _seed % __max + 1;
        return (number);
    }

}

contract Cards is Ownable {

    struct Game {
        uint256 status;
        uint256 seed;
        uint256 bet;
        uint256 yourCards;
        uint256 yourCard;
        uint256 yourDice;
        uint256 yourScore;
        uint256 opponentCards;
        uint256 opponentCard;
        uint256 opponentDice;
        uint256 opponentScore;
    }


    address public random;
    address public gameToken;
    uint256 public cardsToDraw;
    uint256 public cardMaxValue;
    uint256[] public betLimits;
    mapping(address => Game) private games;

    constructor(address __random, address __gameToken, uint256 __cardsToDraw, uint256 __cardMaxValue, uint256[] memory __betLimits) {
        random = __random;
        gameToken = __gameToken;
        cardsToDraw = __cardsToDraw;
        cardMaxValue = __cardMaxValue;
        betLimits = __betLimits;
    }

    function setGameToken(address __gameToken) external onlyOwner {
        gameToken = __gameToken;
    }

    function setCardsToDraw(uint256 __cardsToDraw) external onlyOwner {
        cardsToDraw = __cardsToDraw;
    }

    function setCardMaxValue(uint256 __cardMaxValue) external onlyOwner {
        cardMaxValue = __cardMaxValue;
    }

    function setBetLimits(uint256[] memory __betLimits) external onlyOwner {
        betLimits = __betLimits;
    }

    function getBetLimitCount() public view returns (uint256) {
        return betLimits.length;
    }

    function _intToString(uint256 __value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (__value == 0) {
            return "0";
        }
        uint256 _temp = __value;
        uint256 _digits;
        while (_temp != 0) {
            _digits++;
            _temp /= 10;
        }
        bytes memory _buffer = new bytes(_digits);
        while (__value != 0) {
            _digits -= 1;
            _buffer[_digits] = bytes1(uint8(48 + uint256(__value % 10)));
            __value /= 10;
        }
        return string(_buffer);
    }

    function _arrayToString(uint256[] memory __array) internal pure returns (string memory) {
        string memory _buffer = "";
        for (uint256 _i = 0; _i < __array.length; _i++) {
           _buffer = string.concat(_buffer, _i > 0 ? "|" : "", _intToString(__array[_i]));
        }
        return _buffer;
    }

    function _cardsToString(uint256 __cards, uint256 __cardCount) internal view returns (string memory) {
        uint256[] memory _buffer = new uint256[](__cardCount);

        for (uint256 _i = 0; _i < __cardCount; _i++) {
            _buffer[_i] = __cards % cardMaxValue + 1;
            __cards = __cards / cardMaxValue;
        }
        return _arrayToString(_buffer);
    }

    function getBetLimits() external view returns (string memory) {
        return _arrayToString(betLimits);
    }

    modifier validBetLimit(uint256 __amount) {
        //How can i assign access to users address in the array listuser

        for (uint256 _i = 0; _i < betLimits.length; _i++) {
            if (betLimits[_i] == __amount) {
                _;
                return;
            }
        }
        revert("Game: invalid bet amount");
    }

    function bet(uint256 __amount) external validBetLimit(__amount) {
        require(games[msg.sender].status == 0 || games[msg.sender].status == 1000, "Game: there is active game");
        IERC20(gameToken).transferFrom(msg.sender, address(this), __amount);

        games[msg.sender] = Game(1, Random(random).generateSeed(), __amount, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    function deal() external {
        require(games[msg.sender].status == 1, "Game: incorrect game status");
        uint256 _max = cardMaxValue ** cardsToDraw;
        uint256 _number = Random(random).generateNumberFromSeed(games[msg.sender].seed, _max * _max) - 1;

        games[msg.sender].status = 2;
        games[msg.sender].seed = Random(random).generateSeed();
        games[msg.sender].yourCards = _number / _max;
        games[msg.sender].opponentCards = _number % _max;
        games[msg.sender].yourScore = 0;
        games[msg.sender].opponentScore = 0;
    }

    function roll() external {
        require(games[msg.sender].status > 1, "Game: incorrect game status");
        require(games[msg.sender].status < 1000, "Game: incorrect game status");
        uint256 _number = Random(random).generateNumberFromSeed(games[msg.sender].seed, 36) - 1;
        uint256 _cardCount = cardsToDraw + 2 - games[msg.sender].status;
        games[msg.sender].yourDice = _number / 6 + 1;
        uint256 _cardSelected = _number / 6 % _cardCount;
        uint256 _divideBy = cardMaxValue ** _cardSelected;
        games[msg.sender].yourCard = games[msg.sender].yourCards / _divideBy % cardMaxValue + 1;
        games[msg.sender].yourCards = games[msg.sender].yourCards / _divideBy / cardMaxValue * _divideBy + games[msg.sender].yourCards % _divideBy;

        games[msg.sender].opponentDice = _number % 6 + 1;
        _cardSelected = _number % 6 % _cardCount;
        _divideBy = cardMaxValue ** _cardSelected;
        games[msg.sender].opponentCard = games[msg.sender].opponentCards / _divideBy % cardMaxValue + 1;
        games[msg.sender].opponentCards = games[msg.sender].opponentCards / _divideBy / cardMaxValue * _divideBy + games[msg.sender].opponentCards % _divideBy;

        if (games[msg.sender].yourCard > games[msg.sender].opponentCard) {
            games[msg.sender].yourScore++;
        } else if (games[msg.sender].yourCard < games[msg.sender].opponentCard) {
            games[msg.sender].opponentScore++;
        }

        if (_cardCount == 1) {
            games[msg.sender].status = 1000;
            if (games[msg.sender].yourScore > games[msg.sender].opponentScore) {
                IERC20(gameToken).transfer(msg.sender, games[msg.sender].bet * 2);
            }
        } else {
            games[msg.sender].status++;
            games[msg.sender].seed = Random(random).generateSeed();
        }
    }

    function surrender() external {
        require(games[msg.sender].status > 1, "Game: incorrect game status");
        require(games[msg.sender].status < 1000, "Game: incorrect game status");

        games[msg.sender].status = 1000;
        games[msg.sender].opponentScore = cardsToDraw;
        games[msg.sender].yourScore = 0;
    }

    function getGame(address __player) external view returns (uint256 status, uint256 amount, string memory cards1, uint256 card1, uint256 dice1, uint256 score1, string memory cards2, uint256 card2, uint256 dice2, uint256 score2) {
        if (games[__player].status == 0) {
            return (0, 0, "", 0, 0, 0, "", 0, 0, 0);
        } else if (games[__player].status == 1) {
            return (1, games[__player].bet, "", 0, 0, 0, "", 0, 0, 0);
        } else {
            status = games[__player].status;
            uint256 _cardsLeft = 0;
            if (status < 1000) {
                _cardsLeft = cardsToDraw + 2 - status;
            }
            amount = games[__player].bet;
            cards1 = _cardsToString(games[__player].yourCards, _cardsLeft);
            cards2 = _cardsToString(games[__player].opponentCards, _cardsLeft);
            card1 = games[__player].yourCard;
            card2 = games[__player].opponentCard;
            dice1 = games[__player].yourDice;
            dice2 = games[__player].opponentDice;
            score1 = games[__player].yourScore;
            score2 = games[__player].opponentScore;
            return (status, amount, cards1, card1, dice1, score1, cards2, card2, dice2, score2);
        }
    }

    function withdraw(uint256 __amount) external onlyOwner {
        if (__amount == 0) {
            __amount = address(this).balance;
        }
        payable(msg.sender).transfer(__amount);
    }

    function withdraw(address __token, uint256 __amount) external onlyOwner {
        if (__amount == 0) {
            __amount = IERC20(__token).balanceOf(address(this));
        }
        IERC20(__token).transfer(msg.sender, __amount);
    }

}

//[100000000000000000000, 200000000000000000000, 400000000000000000000, 800000000000000000000, 1600000000000000000000]
