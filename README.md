# Waldo Photos Engineering Project

We believe the best method to assess a software engineer is to present them with an application problem relevant to the company. This helps us focus on assessing the most practical aspects of an engineer's ability rather than assessing that which is nice to have, but is not likely to be a daily necessity.

The goal of this project is to produce a working system that can be used as a conversation piece during your on-site interview. Be prepared to:

* Present your solution to a group of smart engineers like yourself.
* Talk about the decisions that went into the creation of your solution. 
* Explain how you see the solution evolving over time. 
* Discuss the runtime characteristics of the system.
* Discuss technical design tradeoffs and the cost-benefit analysis of those decisions.

### Deliverable

Using any language and data-store of your choice, write an application that reads a set of photos from a network store (S3), parses the EXIF data from the photos and indexes the EXIF data into a datastore.

Requirements:
- Given a photo hash, the EXIF data should be returned.
- Given a photo hash and a string key, the corresponding value for the EXIF data K/V pair should be returned.

Please deliver the finished project in a publicly available repository on Github. Please title the repository as `waldo-${ github-handle }` .

Deliveries via private repos, BitBucket, or anything other than what is specified above will be disqualified.

### Evaluation

The main areas we will be evaluating are:

- organization of responsibility
- concurrency composition
- performance
- resilience to failures.

### Resources

* S3 Bucket (input): http://s3.amazonaws.com/waldo-recruiting