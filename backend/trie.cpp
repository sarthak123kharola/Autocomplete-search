// trie.cpp
#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>
using namespace std;

struct TrieNode {
    TrieNode* children[26];
    bool isEnd;

    TrieNode() {
        isEnd = false;
        fill(begin(children), end(children), nullptr);
    }
};

class Trie {
    TrieNode* root;

    void dfs(TrieNode* node, string& prefix, vector<string>& results) {
        if (results.size() >= 10) return;
        if (node->isEnd) results.push_back(prefix);
        for (int i = 0; i < 26; ++i) {
            if (node->children[i]) {
                prefix.push_back('a' + i);
                dfs(node->children[i], prefix, results);
                prefix.pop_back();
            }
        }
    }

public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }

    vector<string> getSuggestions(const string& prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!node->children[idx]) return {};
            node = node->children[idx];
        }

        vector<string> results;
        string temp = prefix;
        dfs(node, temp, results);
        return results;
    }
};

int main(int argc, char* argv[]) {
    if (argc != 2) return 1;

    string prefix = argv[1];
    Trie trie;
    string word;
    ifstream fin("input.txt");
    while (fin >> word) trie.insert(word);

    vector<string> suggestions = trie.getSuggestions(prefix);
    for (const string& s : suggestions) {
        cout << s << endl;
    }

    return 0;
}
