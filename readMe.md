# Hyperledger Fabric Supply Tracking Activity

## Development Environment:
#### Operating System: Ubuntu XFCE 18.04.2 (Xubuntu) LTS
#### Hyperledger Fabric Version : 1.4
#### Go Version : 1.10

## PreRequisites:
1. Download github.com/ashtikuno/prerequisites.sh
2. Install Go https://golang.org/doc/install
    <br/>
    * To check the where the Go Path, Go Root, and Go Cache is located, run: `go env`
3. Install cURL: `sudo apt install curl -y`
4. `curl -sSL https://github.com/hyperledger/fabric/blob/release-1.4/scripts/bootstrap.sh | bash -s 1.4.0`
5. This will download the needed binaries and then put it into the bin folder of the download path.
6. Export the download path using: `export PATH=<path to download location>/bin:$PATH`
7. Run on command line:
<pre>
        go get github.com/golang/protobuf/proto
        go get github.com/hyperledger/fabric/common/attrmgr
        go get github.com/pkg/errors
        go get github.com/hyperledger/fabric/core/chaincode/lib/cid
</pre>

## Usage
1. `git clone https://github.com/ashtikuno/HyperledgerActivity-SupplyTracking.git`
<br/>
Output:
<pre>fabric-samples/
  | ---- invoiceHyperledgerActivity-SupplyTracking/
                        | ---- Activity Instructions
                        | ---- basic-network
                        | ---- chaincode/supplytracking/go
                        | ---- supplytracking
</pre>
2. Change Directory to `/supplytracking` 
  <br/>
  2.a. Install Dependencies by executing the following command: `npm install` or `npm i`
  2.b. 

## License

Copyright (c) 2019 Rico Regala
Licensed under the [Apache License 2.0](LICENSE)